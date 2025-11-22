// components/Timer.tsx
"use client";
import { useEffect, useState } from "react";

type Props = { totalSeconds: number; onTimeUp: () => void; onTick?: (s: number) => void };

export default function Timer({ totalSeconds, onTimeUp, onTick }: Props) {
  const [secondsLeft, setSecondsLeft] = useState<number>(totalSeconds);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (onTick) onTick(secondsLeft);
    if (secondsLeft <= 0) onTimeUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const mm = Math.floor(Math.max(0, secondsLeft) / 60);
  const ss = Math.floor(Math.max(0, secondsLeft) % 60);

  return (
    <div className="font-mono text-lg">
      <span>{String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}</span>
    </div>
  );
}
