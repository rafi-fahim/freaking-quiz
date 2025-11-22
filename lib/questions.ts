// lib/questions.ts
export type Q = {
  id: string;
  text: string;
  image?: string | null;
  choices: string[]; // length 4
  answerIndex: number; // 0..3
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
  // add up to 30 questions here...
];
