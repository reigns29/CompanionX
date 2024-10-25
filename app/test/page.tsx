"use client";

import React, { useState, useEffect } from "react";

interface SpeechRecognitionError extends Error {
  error: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

type SpeechRecognitionResults = SpeechRecognitionResult[][];

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResults;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
  onstart: () => void;
}

// Extend the Window interface
interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

const Voice = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert(
        "Your browser does not support Speech Recognition. Try using Chrome."
      );
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecogniton ||
      (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = "en-US";
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.results.length - 1][0].transcript;
      setTranscript((prev) => prev + " " + lastResult);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionInstance.onend = () => {
      if (recording) {
        recognitionInstance.start();
      }
    };

    setRecognition(recognitionInstance);
  }, [recording]);

  const toggleRecording = () => {
    if (recognition) {
      if (recording) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setRecording(!recording);
    }
  };

  const handleSpeak = () => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(inputText);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-5">
      <div className="mb-6 w-full max-w-lg p-6 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105">
        <button
          onClick={toggleRecording}
          className={`w-full px-6 py-3 rounded-xl text-md font-semibold tracking-wide transition-colors text-white ${
            recording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>

      <div className="mb-6 w-full max-w-lg p-6 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105">
        <h3 className="text-xl font-bold mb-3 text-gray-700">
          Recorded Transcript:
        </h3>
        <div className="bg-gray-100 p-4 rounded-lg h-32 overflow-y-auto border border-gray-300 text-gray-700">
          {transcript || "No transcription yet..."}
        </div>
      </div>

      <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105">
        <h3 className="text-xl font-bold mb-3 text-gray-700">
          Text to Speech:
        </h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type text here"
          />
          <button
            onClick={handleSpeak}
            className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition"
          >
            Play Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default Voice;
