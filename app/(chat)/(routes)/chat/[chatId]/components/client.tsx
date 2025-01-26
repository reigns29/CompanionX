"use client";

import React, { FormEvent, useState, useEffect } from "react";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCompletion, useChat } from "ai/react";

import ChatHeader from "@/components/chat-header";
import ChatForm from "@/components/chat-form";
import ChatMessages from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";

interface MessageWithFile {}

interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export default function ChatClient({ companion }: ChatClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages
  );
  const [file, setFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<null | string>(null);

  useEffect(() => {
    if (file) {
      console.log("File state updated:", file); // This will log when `file` state changes
    }
  }, [file]);

  const onFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const urlImage = URL.createObjectURL(selectedFile);
      setPreviewUrl(urlImage);
      console.log("File selected:", file);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
      file: file
    };

    setMessages((current) => [...current, userMessage]);

    handleSubmit(e);
  };

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${companion.id}`,
      body: { name: "Ansh"},
      onFinish(prompt, completion) {
        console.log(file);
        console.log(prompt);
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion
        };

        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      }
    });

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        handleInputChange={handleInputChange}
        input={input}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onFileChange={onFileChange}
        previewUrl={previewUrl}
      />
    </div>
  );
}
