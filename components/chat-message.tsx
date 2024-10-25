"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { BeatLoader } from "react-spinners";
import { Copy, Volume1, Zap, Save } from "lucide-react";

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
  Type: string;
  Name: string;
  Link: string;
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
  const [suggestions, setSuggestions] = useState<null | Suggestion[]>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const handleSuggestions = async () => {
    setSuggestionLoading(true);
    console.log(content);
    const response = await axios.post("/api/suggestions/generate", {
      content: content
    });
    let cleanedResponse = response.data.data.answer;
    cleanedResponse = cleanedResponse.slice(7, -3);
    let jsonArray = JSON.parse(cleanedResponse);
    setSuggestions(jsonArray);
    setSuggestionLoading(false);
    console.log(jsonArray);
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

  const handleSaveSuggestion = async (suggestion: Suggestion) => {
    const response = await axios.post("/api/suggestions/save", {
      suggestion
    });
    console.log(response);
    toast({
      description: "Suggestion saved successfully."
    });
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
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white rounded shadow-lg hidden group-hover:block">
                Suggestions
              </div>
            </Button>
          </div>
        )}
      </div>
      {!suggestionLoading ? (
        <div className="max-w-[400px] ml-14 flex flex-col space-x-2 space-y-2">
          {role !== "user" &&
            suggestions &&
            suggestions.map((suggestion: Suggestion) => (
              <div
                className="flex space-x-1"
                key={suggestion.Link as React.Key}
              >
                <button className="bg-gray-800 rounded-md text-xs">
                  {suggestion.Type}:{" "}
                  <a href={suggestion.Link} target="_blank">
                    {suggestion.Name}
                  </a>
                </button>
                <button onClick={() => handleSaveSuggestion(suggestion)}>
                  <Save className="w-3 h-3" />
                </button>
              </div>
            ))}
        </div>
      ) : (
        <div className="ml-14">
          <h1 className="text-xs text-green-700">Generating Suggestions</h1>
          <BeatLoader size={5} color={theme === "light" ? "black" : "white"} />
        </div>
      )}
    </div>
  );
}
