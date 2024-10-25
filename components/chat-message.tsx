"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { BeatLoader } from "react-spinners";
import { Copy, Volume1, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import BotAvatar from "@/components/bot-avatar";
import UserAvatar from "@/components/user-avatar";
import { Button, buttonVariants } from "./ui/button";
import axios from "axios";

export interface ChatMessageProps {
  role: "system" | "user";
  content?: string;
  isLoading?: boolean;
  src?: string;
}

interface Suggestion {
  id: Number;
  title: String;
}

export default function ChatMessage({
  role,
  content,
  isLoading,
  src
}: ChatMessageProps) {
  const { toast } = useToast();
  const { theme } = useTheme();

  const [openChats, setOpenChats] = useState([]);
  const [suggestions, setSuggestions] = useState([
    { id: 1, title: "Book: Zero to One" },
    { id: 2, title: "Course: Innovation Management" },
    { id: 3, title: 'Quote: "Failure is a stepping stone"' }
  ]);
  const handleSuggestions = async () => {
    console.log(content);
    const response = await axios.post("/api/suggestions", {
      content: content
    });
    console.log(response.data.data.answer);
  };

  const onCopy = () => {
    if (!content) return;

    navigator.clipboard.writeText(content);
    toast({ description: "Message Copied to Clipboard.", duration: 3000 });
  };

  const handleSpeak = () => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <div
        className={cn(
          "group flex items-start gap-x-3 py-4 w-full",
          role === "user" && "justify-end"
        )}
      >
        {role !== "user" && src && <BotAvatar src={src} />}
        <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
          {isLoading ? (
            <BeatLoader
              size={5}
              color={theme === "light" ? "black" : "white"}
            />
          ) : (
            content
          )}
        </div>
        {role === "user" && <UserAvatar />}
        {role !== "user" && (
          <div>
            <Button
              className="opacity-0 group-hover:opacity-100 transition"
              onClick={onCopy}
              size="icon"
              variant="ghost"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              className="opacity-0 group-hover:opacity-100 transition"
              onClick={handleSpeak}
              size="icon"
              variant="ghost"
            >
              <Volume1 className="w-4 h-4" />
            </Button>
            <Button
              className="opacity-0 group-hover:opacity-100 transition"
              onClick={handleSuggestions}
              size="icon"
              variant="ghost"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="max-w-[400px] ml-14 flex flex-wrap space-x-2 space-y-2">
        {role !== "user" &&
          suggestions.map((suggestion: Suggestion) => (
            <div key={suggestion.id as React.Key}>
              <button className="bg-gray-800 rounded-md text-xs">
                {suggestion.title}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
