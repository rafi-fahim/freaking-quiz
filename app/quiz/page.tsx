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
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
      <div className="max-w-md w-full bg-neutral-800  p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Math Quiz — 30 MCQs</h1>
        <label className="block mb-2 text-sm">Your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded mb-4" placeholder="Enter name" />
        <p className="text-sm text-gray-500 mb-4">You have 30 minutes. Once you select an answer for a question it cannot be changed.</p>
        <button onClick={start} className="w-full py-3 rounded bg-blue-600 text-white">Start Quiz</button>
      </div>
    </div>
  );
}
