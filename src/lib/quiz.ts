import type { QuizQuestion } from "../types";
import { PASS_MARK, toPercentage } from "./progress";

export const QUIZ_SECONDS = 60;

export interface QuizState {
  questions: QuizQuestion[];
  current: number;
  score: number;
  selected: number | null;
  timeLeft: number;
  finished: boolean;
}

export type QuizAction =
  | { type: "select"; index: number }
  | { type: "next" }
  | { type: "tick" };

export function initQuiz(questions: QuizQuestion[]): QuizState {
  return { questions, current: 0, score: 0, selected: null, timeLeft: QUIZ_SECONDS, finished: false };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  if (state.finished) return state;
  switch (action.type) {
    case "select":
      return action.index >= 0 && action.index < state.questions[state.current].options.length
        ? { ...state, selected: action.index }
        : state;
    case "next": {
      if (state.selected === null) return state;
      const score = state.score + (state.selected === state.questions[state.current].answer ? 1 : 0);
      const last = state.current + 1 >= state.questions.length;
      return last
        ? { ...state, score, selected: null, finished: true }
        : { ...state, score, current: state.current + 1, selected: null };
    }
    case "tick": {
      const timeLeft = state.timeLeft - 1;
      // When time runs out the quiz ends with the score so far (as in the original).
      return timeLeft <= 0 ? { ...state, timeLeft: 0, finished: true } : { ...state, timeLeft };
    }
  }
}

export function quizSummary(state: QuizState) {
  const percentage = toPercentage(state.score, state.questions.length);
  return {
    score: state.score,
    total: state.questions.length,
    percentage,
    passed: percentage >= PASS_MARK,
  };
}
