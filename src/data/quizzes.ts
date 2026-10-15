import type { QuizQuestion } from "../types";

// Only courses 1-3 have quizzes (same as the original app).
export const quizzes: Record<number, QuizQuestion[]> = {
  1: [
    { question: "What is the value of x in 2x + 6 = 14?", options: ["2", "4", "6", "8"], answer: 1 },
    {
      question: "What is the area of a rectangle with length 8cm and width 5cm?",
      options: ["13cm²", "26cm²", "40cm²", "80cm²"],
      answer: 2,
    },
    { question: "What is 25% of 200?", options: ["25", "40", "50", "75"], answer: 2 },
  ],
  2: [
    { question: "What is the SI unit of force?", options: ["Joule", "Newton", "Watt", "Pascal"], answer: 1 },
    { question: "Which quantity is measured in watts?", options: ["Energy", "Power", "Force", "Mass"], answer: 1 },
    {
      question: "What happens when resistance increases while voltage remains constant?",
      options: ["Current increases", "Current decreases", "Voltage increases", "Power always becomes zero"],
      answer: 1,
    },
  ],
  3: [
    { question: "Which keyword creates a block-scoped variable?", options: ["var", "let", "define", "variable"], answer: 1 },
    {
      question: "Which method converts JSON text into a JavaScript object?",
      options: ["JSON.parse()", "JSON.convert()", "JSON.object()", "JSON.read()"],
      answer: 0,
    },
    { question: "Which method adds an item to the end of an array?", options: ["pop()", "shift()", "push()", "add()"], answer: 2 },
  ],
};

export function getQuiz(courseId: number): QuizQuestion[] | undefined {
  return quizzes[courseId];
}
