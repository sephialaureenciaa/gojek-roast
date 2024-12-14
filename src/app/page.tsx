"use client";

import { useState } from "react";
import FileUpload from "@/app/components/FileUpload";
import HowToSheet from "@/app/components/HowToSheet";

type GenerateResponse = {
  response: string;
};

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<GenerateResponse | undefined>();
  const [error, setError] = useState<string | undefined>();

  const handleUpload = async (images: string[] | undefined) => {
    if (images === undefined || images.length === 0) {
      setError("🤖: 404 file not found");
      return;
    }

    // Reset state
    setSubmitting(true);
    setResponse(undefined);
    setError(undefined);

    const formData = new FormData();
    for (const image of images) {
      formData.append("file", image);
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to generate roast");
      }

      const json = await res.json();
      setResponse(json as GenerateResponse);
    } catch (error) {
      console.error(error);
      setError(
        "whoops, something went wrong 😓\npls try again, or contact us at gojekroast@gmail.com if the issue persists 👉👈"
      );
    }

    setSubmitting(false);
  };

  return (
    <main className="flex flex-col mx-auto gap-6 p-16 max-w-lg h-screen mb-4">
      <h1 className="text-xl font-bold text-center text-gray-800">
        Exposing Your Gojek Life, One Ride at a Time 🛵 🔍
      </h1>
      <FileUpload handleUpload={handleUpload} isSubmitting={submitting} />
      {error && (
        <p className="text-center text-sm whitespace-pre-line">{error}</p>
      )}
      {response && (
        <p className="whitespace-pre-line">{formatText(response.response)}</p>
      )}
      <HowToSheet />
      <p className="self-center text-sm text-black opacity-35 mb-4">
        © 2024 gojekroast.me
      </p>
    </main>
  );
}

const formatText = (inputText: string) => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = inputText.split(boldRegex);

  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else {
      return <strong key={index}>{part}</strong>;
    }
  });
};
