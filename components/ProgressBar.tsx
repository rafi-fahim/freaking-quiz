// components/ProgressBar.tsx
"use client";
export default function ProgressBar({ total, answered }: { total: number; answered: number }) {
  const pct = total === 0 ? 0 : Math.round((answered / total) * 100);
  return (
    <div className="w-full">
      <div className="text-sm mb-2 text-neutral-300">Progress: {answered}/{total} ({pct}%)</div>
      <div className="w-full bg-neutral-700 rounded h-3">
        <div
          className="h-3 rounded"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#7c93ff,#6ee7b7)"
          }}
        />
      </div>
    </div>
  );
}
