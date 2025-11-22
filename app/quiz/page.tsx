// app/quiz/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizHome() {
  const [name, setName] = useState("");
  const router = useRouter();

  const start = () => {
    if (!name.trim()) return alert("Enter your name");
    localStorage.setItem("quiz_name", name.trim());
    router.push("/quiz/start");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#3a3b44] p-6 rounded-lg border border-[#4a4b52]">
        <h1 className="text-2xl font-bold mb-4">Math Quiz — 30 MCQs</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 rounded mb-4 bg-[#2f3035] text-[#E6E7E9] border border-[#4a4b52]"
        />
        <p className="text-sm text-[#bfc3c6] mb-4">You will have 30 minutes. Once you select an answer it cannot be changed.</p>
        <button onClick={start} className="w-full py-3 rounded bg-[#7c93ff] text-black font-semibold hover:opacity-95">Start Quiz</button>
      </div>
    </div>
  );
}
