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

export default function QuestionCard({
  q,
  index,
  selectedIndex,
  locked,
  showResults,
  onSelect,
}: Props) {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-neutral-800 border-neutral-700 text-neutral-200 shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium">Q{index + 1}. {q.text}</div>
      </div>

      {q.image && (
        <div className="mb-3">
          <img
            src={q.image}
            alt={`q${index + 1}`}
            className="max-w-full h-auto rounded border border-neutral-700"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {q.choices.map((choice, ci) => {
          let base =
            "p-3 text-left rounded border transition-colors duration-150 font-medium";
          let state = "bg-neutral-700 text-neutral-200 border-neutral-600";

          if (!showResults) {
            if (selectedIndex === ci) {
              state = "bg-blue-600 text-white border-blue-700";
            }
          } else {
            if (ci === q.answerIndex) {
              state = "bg-green-600 text-white border-green-700";
            } else if (selectedIndex === ci && ci !== q.answerIndex) {
              state = "bg-red-600 text-white border-red-700";
            } else {
              state = "bg-neutral-700 text-neutral-400 border-neutral-600 opacity-80";
            }
          }

          // If answer locked and this isn't selected
          if (locked && selectedIndex !== ci && !showResults) {
            state += " opacity-60 cursor-not-allowed";
          }

          return (
            <button
              key={ci}
              onClick={() => {
                if (locked) return;
                onSelect(q.id, ci);
              }}
              disabled={locked}
              className={`${base} ${state}`}
            >
              {String.fromCharCode(65 + ci)}. {choice}
            </button>
          );
        })}
      </div>

      {showResults && (
        <div className="mt-3 text-sm">
          {selectedIndex === null ? (
            <span className="text-orange-400">
              Not answered — correct:{" "}
              <span className="font-semibold text-neutral-100">
                {q.choices[q.answerIndex]}
              </span>
            </span>
          ) : selectedIndex === q.answerIndex ? (
            <span className="text-green-400 font-semibold">Correct ✓</span>
          ) : (
            <span className="text-red-400 font-semibold">
              Wrong ✗ — Correct:{" "}
              <span className="font-semibold text-neutral-100">
                {q.choices[q.answerIndex]}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
