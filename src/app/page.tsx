"use client";

import { useState } from "react";
import FileUpload from "@/app/components/FileUpload";
import HowToSheet from "@/app/components/HowToSheet";

export default function Home() {
  const [submitted, setSubmmited] = useState(false);

  const handleUpload = async (file: File | undefined) => {
    if (file === undefined) return;

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });
    console.log(res);
    setSubmmited(true);
  };

  return (
    <main className="flex flex-col mx-auto gap-6 p-16 max-w-lg h-screen">
      <h1 className="text-xl font-bold text-center text-gray-800">
        Exposing Your Gojek Life, One Ride at a Time 🛵 🔍
      </h1>
      {!submitted ? (
        <>
          <FileUpload handleUpload={handleUpload} />
          <HowToSheet />
        </>
      ) : (
        <>submitted!</>
      )}
      <p className="self-center text-sm text-black opacity-35">© 2024 gojekroast.me</p>
    </main>
  );
}
