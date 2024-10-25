import { NextResponse } from "next/server";
import axios from "axios";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { content } = body;

        const prompt = `Based on a chat message from an AI companion discussing the recent Starship booster landing and the vision of space exploration, please provide a JSON response with 4 recommendations. Each recommendation should include:
            Type (book, course, video, product)
            Name of the item
            Link to the item
            Here's the chat message from the companion for context:\n${content}\n
        Please respond in JSON format with the recommendations.`

        const response = await axios.post("https://api.on-demand.io/chat/v1/sessions/671b4dff0b25466bf27c2c33/query", {
            endpointId: "predefined-openai-gpt4o",
            query: prompt,
            pluginIds: [
                'plugin-1712327325',
                'plugin-1713962163',
                'plugin-1717448083',
                'plugin-1716334779',
                'plugin-1717503940',
                'plugin-1720113770'
            ],
            responseMode: "sync"
        }, {
            headers: {
                "Content-Type": "application/json",
                "apikey": process.env.ONDEMAND_API_KEY
            }
        })

        // console.log(response.data);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("[Getting suggestion]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

