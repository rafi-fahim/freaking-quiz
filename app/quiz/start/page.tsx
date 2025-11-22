// app/quiz/start/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import { QUESTIONS, Q } from "@/lib/questions";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type AnswerRecord = {
  questionId: string;
  choiceIndex: number | null;
  selectedAt: number | null;
  isCorrect?: boolean;
};

const TOTAL_SECONDS = 30 * 60; // 30 minutes

export default function QuizStartPage() {
  const router = useRouter();
  const [startTs, setStartTs] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  useEffect(() => {
    const saved = localStorage.getItem("quiz_answers");
    if (saved) setAnswers(JSON.parse(saved));
    setStartTs(Date.now());
  }, []);

  useEffect(() => {
    localStorage.setItem("quiz_answers", JSON.stringify(answers));
  }, [answers]);

  const answeredCount = useMemo(() => Object.values(answers).filter(a => a.choiceIndex !== null).length, [answers]);

  const handleSelect = (qId: string, choiceIndex: number) => {
    if (answers[qId] && answers[qId].choiceIndex !== null) return; // locked
    setAnswers(prev => ({
      ...prev,
      [qId]: { questionId: qId, choiceIndex, selectedAt: Date.now() }
    }));
  };

  const evaluateAll = (): { records: AnswerRecord[]; score: number; wrongList: Q[] } => {
    const records: AnswerRecord[] = QUESTIONS.map(q => {
      const rec = answers[q.id];
      const selected = rec ? rec.choiceIndex : null;
      const selectedAt = rec ? rec.selectedAt : null;
      const isCorrect = selected !== null ? selected === q.answerIndex : false;
      return { questionId: q.id, choiceIndex: selected, selectedAt, isCorrect };
    });
    const score = records.filter(r => r.isCorrect).length;
    const wrongList = QUESTIONS.filter((q) => {
      const r = records.find(x => x.questionId === q.id);
      return !r?.isCorrect;
    });
    return { records, score, wrongList };
  };

  const submit = async () => {
    if (showResults) return;
    const name = localStorage.getItem("quiz_name") || "Anonymous";
    const startedAt = startTs;
    const submittedAt = Date.now();
    const durationMs = startedAt ? submittedAt - startedAt : null;
    const { records, score } = evaluateAll();

    const attempt = {
      name,
      startedAt,
      submittedAt,
      durationMs,
      score,
      total: QUESTIONS.length,
      answers: records,
      createdAt: serverTimestamp(),
    };

    try {
      setSaving(true);
      // Save to Firestore (optional) — remove if offline-only
      await addDoc(collection(db, "quizAttempts"), attempt as any);
    } catch (e) {
      console.error("Saving attempt failed", e);
    } finally {
      setSaving(false);
      setShowResults(true);
      localStorage.setItem("quiz_final", JSON.stringify({ score, total: QUESTIONS.length, records }));
    }
  };

  const onTimeUp = () => {
    submit();
    setSecondsLeft(0);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-[#bfc3c6]">Name</div>
            <div className="font-medium">{localStorage.getItem("quiz_name") || "Anonymous"}</div>
          </div>

          <div className="flex items-center space-x-6">
            <div>
              <div className="text-sm text-[#bfc3c6]">Time left</div>
              <Timer totalSeconds={TOTAL_SECONDS} onTimeUp={onTimeUp} onTick={(s)=>setSecondsLeft(s)} />
            </div>
            <div className="w-60">
              <ProgressBar total={QUESTIONS.length} answered={answeredCount} />
            </div>
          </div>
        </div>

        <div>
          {QUESTIONS.map((q, idx) => (
            <QuestionCard
              key={q.id}
              q={q}
              index={idx}
              selectedIndex={answers[q.id]?.choiceIndex ?? null}
              locked={!!(answers[q.id] && answers[q.id].choiceIndex !== null)}
              showResults={showResults}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-[#bfc3c6]">Answered: {answeredCount}/{QUESTIONS.length}</div>
          <div className="flex space-x-3">
            <button
              onClick={() => { localStorage.setItem("quiz_answers", JSON.stringify(answers)); alert("Saved locally"); }}
              className="px-4 py-2 rounded bg-[#2f3035] text-[#E6E7E9] border border-[#4a4b52]"
            >
              Save Progress
            </button>
            <button
              onClick={submit}
              disabled={saving || showResults}
              className="px-4 py-2 rounded bg-[#7c93ff] text-black font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Submit Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
