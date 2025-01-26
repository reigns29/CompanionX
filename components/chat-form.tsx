"use client";

import React, { ChangeEvent, FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { SendHorizonal, Mic } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatFormProps {
  input: string;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  onFileChange: (e: any) => void;
  previewUrl: null | string;
  isLoading: boolean;
}

const handleSpeech = () => {
  console.log("handle speak");
};

export default function ChatForm({
  handleInputChange,
  input,
  isLoading,
  onSubmit,
  onFileChange,
  previewUrl
}: ChatFormProps) {
  return (
    <div className="flex items-center">
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          style={{ maxWidth: "100px", maxHeight: "100px" }}
        />
      )}
      <form
        onSubmit={onSubmit}
        className="border-t border-primary/10 py-4 flex items-center gap-x-2 w-[1000px]"
      >
        <label className="cursor-pointer flex items-center space-x-1">
          <input type="file" onChange={onFileChange} className="hidden" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 text-gray-500 hover:text-blue-500 transition duration-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6.75v10.5a3.75 3.75 0 01-7.5 0v-9a2.25 2.25 0 114.5 0v8.25a.75.75 0 01-1.5 0V8.25"
            />
          </svg>
          {/* {fileName && (
            <span className="text-sm text-gray-700">{fileName}</span>
          )} */}
        </label>
        <Input
          disabled={isLoading}
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="rounded-lg bg-primary/10"
        />

        <Button disabled={isLoading} variant="ghost">
          <SendHorizonal className="w-6 h-6" />
        </Button>
      </form>
      <Button disabled={isLoading} variant="ghost" onClick={handleSpeech}>
        <Mic className="w-6 h-6" />
      </Button>
    </div>
  );
}
