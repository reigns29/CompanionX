import dotenv from "dotenv";
import { auth, currentUser } from "@clerk/nextjs";

import { ratelimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";

// added new
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const MODEL = "intfloat/multilingual-e5-large";
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

const index = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})
  .index("companion")
  .namespace("ns1");

dotenv.config({ path: `.env` });

async function fetchEmbeddingsWithRetry(text: string, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${MODEL}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        if (response.status === 503) {
          console.warn(`Model is loading, retrying (${attempt}/${retries})...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          console.error("Error response body:", errorBody);
          throw new Error(`Failed to fetch embeddings: ${response.statusText}`);
        }
      } else {
        return await response.json();
      }
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
    }
  }
}

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();
    console.log("Prompt", prompt);

    if (!user || !user.firstName || !user.id)
      return new NextResponse("Unauthorized!", { status: 401 });

    const identifier = request.url + "-" + user.id;
    const { success } = await ratelimit(identifier);

    if (!success)
      return new NextResponse("Ratelimit Exceeded!", { status: 429 });

    const companion = await prismadb.companion.update({
      where: { id: params.chatId },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id
          }
        }
      }
    });

    console.log(companion);

    if (!companion)
      return new NextResponse("Companion Not Found.", { status: 404 });

    const name = companion.id;
    const companion_file_name = name + ".txt";

    const companionKey = {
      companionName: name,
      userId: user.id,
      modelName: "gemini-1.5-flash"
    };

    // const memoryManager = await MemoryManager.getInstance();

    const queryEmbedding = await fetchEmbeddingsWithRetry(prompt);
    console.log("Query Embedding", queryEmbedding);
    const results = await index.query({
      vector: queryEmbedding,
      topK: 3,
    });

    let id = `interaction-${Date.now()}`
    await index.upsert([{ id, values: queryEmbedding }])

    const systemPrompt = `PREAMBLE:\n
    ${companion.instructions}\n
    SEED_CHAT:\n
    ${companion.seed}.
    `;
    console.log(systemPrompt);
    const context = results.matches.map((match) => match?.metadata?.review).join("\n");
    console.log(context);
    const modifiedPrompt = `${systemPrompt}\n\n**Query:** ${prompt}\n\n**Context:** ${context}`;
    console.log(modifiedPrompt);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(modifiedPrompt);
    let response = result.response.text();
    let formattedResponse = response
      .replace(/\*/g, '') // Remove asterisks
      .replace(/\. "/g, `.\n\n"`) // Add new lines before quotes
      .replace(/\. /g, '.\n'); // Add new lines after periods

    response = formattedResponse;

    console.log(response);

    if (response !== undefined && response.length > 1) {

      await prismadb.companion.update({
        where: {
          id: params.chatId
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "system",
              userId: user.id
            }
          }
        }
      });
    }

    return new NextResponse(response);
  } catch (error) {
    console.error("[CHAT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
