// components/QuestionCard.tsx
"use client";
import React from "react";
import { Q } from "@/lib/questions";

type Props = {
  q: Q;
  index: number;
  selectedIndex: number | null;
  locked: boolean;
  showResults: boolean;
  onSelect: (qId: string, choiceIndex: number) => void;
};

export default function QuestionCard({ q, index, selectedIndex, locked, showResults, onSelect }: Props) {
  return (
    <div className="mb-6 p-4 rounded-lg bg-[#3a3b44] border border-[#4a4b52] text-[#E6E7E9] shadow">
      <div className="mb-2 font-medium">Q{index + 1}. {q.text}</div>

      {q.image && (
        <div className="mb-3">
          <img src={q.image} alt={`q${index + 1}`} className="max-w-full h-auto rounded border border-neutral-600" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {q.choices.map((choice, ci) => {
          const isSelected = selectedIndex === ci;
          let classes = "p-3 rounded border font-medium transition-colors";

          if (!showResults) {
            // before submit
            classes += isSelected ? " bg-blue-600 text-white border-blue-700" : " bg-[#2f3035] text-[#E6E7E9] border-[#4a4b52] hover:shadow";
            if (locked && !isSelected) classes += " opacity-70 cursor-not-allowed";
          } else {
            // after submit: correct green, selected wrong red, others muted
            if (ci === q.answerIndex) {
              classes += " bg-[#22c55e] text-black border-[#16a34a]";
            } else if (isSelected && ci !== q.answerIndex) {
              classes += " bg-[#ef4444] text-black border-[#dc2626]";
            } else {
              classes += " bg-[#2f3035] text-[#bfc3c6] border-[#4a4b52] opacity-90";
            }
          }

          return (
            <button
              key={ci}
              onClick={() => { if (!locked) onSelect(q.id, ci); }}
              disabled={locked}
              className={classes}
            >
              {String.fromCharCode(65 + ci)}. {choice}
            </button>
          );
        })}
      </div>

      {showResults && (
        <div className="mt-3 text-sm">
          {selectedIndex === null ? (
            <span className="text-orange-300">Not answered — correct: <span className="font-semibold text-[#E6E7E9]">{q.choices[q.answerIndex]}</span></span>
          ) : selectedIndex === q.answerIndex ? (
            <span className="text-[#16a34a] font-semibold">Correct ✓</span>
          ) : (
            <span className="text-[#ef4444] font-semibold">Wrong ✗ — Correct: <span className="font-semibold text-[#E6E7E9]">{q.choices[q.answerIndex]}</span></span>
          )}
        </div>
      )}
    </div>
  );
}
