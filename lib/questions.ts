// lib/questions.ts
export type Q = {
  id: string;           // unique id like "q1"
  text: string;
  image?: string | null; // relative path or URL
  choices: string[];    // exactly 4 entries
  answerIndex: number;  // 0..3 (correct choice)
};

export const QUESTIONS: Q[] = [
  {
    id: "q1",
    text: "What is 7 × 8?",
    choices: ["54", "56", "58", "49"],
    answerIndex: 1,
  },
  {
    id: "q2",
    text: "Solve for x: 2x + 3 = 11",
    choices: ["3", "4", "5", "6"],
    answerIndex: 1,
  },
  // ... add up to 30
];
