// app/quiz/result/page.tsx
"use client";
import { useEffect, useState } from "react";
import { QUESTIONS, Q } from "@/lib/questions";

type RecordRec = {
  questionId: string;
  choiceIndex: number | null;
  selectedAt: number | null;
  isCorrect?: boolean;
};

export default function ResultPage() {
  const [final, setFinal] = useState<{ score: number; total: number; records: RecordRec[] } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("quiz_final");
    if (stored) {
      setFinal(JSON.parse(stored));
    } else {
      // fallback: compute from answers & questions
      const saved = localStorage.getItem("quiz_answers");
      const answers = saved ? JSON.parse(saved) as Record<string, RecordRec> : {};
      const records = QUESTIONS.map(q => {
        const r = answers[q.id];
        const choiceIndex = r?.choiceIndex ?? null;
        const selectedAt = r?.selectedAt ?? null;
        const isCorrect = choiceIndex !== null ? choiceIndex === q.answerIndex : false;
        return { questionId: q.id, choiceIndex, selectedAt, isCorrect };
      });
      const score = records.filter(r => r.isCorrect).length;
      setFinal({ score, total: QUESTIONS.length, records });
    }
  }, []);

  if (!final) return <div className="p-6">Loading...</div>;

  const wrongs = final.records.filter(r => !r.isCorrect);

  return (
    <div className="min-h-screen bg-neutral-700 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">Quiz Result</h1>
        <div className="mb-4">
          Score: <span className="font-semibold">{final.score}/{final.total}</span>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">Questions you missed ({wrongs.length})</h2>
          {wrongs.length === 0 ? (
            <div className="text-green-600">All correct — great job!</div>
          ) : (
            <div className="space-y-4">
              {wrongs.map(r => {
                const q = QUESTIONS.find(x => x.id === r.questionId) as Q;
                return (
                  <div key={q.id} className="p-3 border rounded">
                    <div className="font-medium mb-1">{q.text}</div>
                    {q.image && <img src={q.image} alt={q.id} className="mb-2 max-w-full" />}
                    <div className="text-sm">Your answer: <span className="font-semibold">{r.choiceIndex === null ? "No answer" : q.choices[r.choiceIndex]}</span></div>
                    <div className="text-sm">Correct answer: <span className="font-semibold">{q.choices[q.answerIndex]}</span></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { localStorage.removeItem("quiz_answers"); localStorage.removeItem("quiz_final"); window.location.href = "/"; }}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
