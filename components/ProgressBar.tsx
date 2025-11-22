// components/ProgressBar.tsx
"use client";
import React from "react";

export default function ProgressBar({ total, answered }: { total: number; answered: number }) {
  const pct = total === 0 ? 0 : Math.round((answered / total) * 100);
  return (
    <div className="w-full">
      <div className="text-sm mb-2">Progress: {answered}/{total} ({pct}%)</div>
      <div className="w-full bg-gray-200 rounded h-3">
        <div className="h-3 rounded bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
