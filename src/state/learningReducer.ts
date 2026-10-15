import type { Profile, QuizResult } from "../types";
import type { CompletedMap } from "../lib/progress";
import {
  KEYS, loadCompleted, loadIdList, loadProfile, loadQuizResults,
} from "../lib/storage";

export interface LearningState {
  enrolled: number[];
  favorites: number[];
  completed: CompletedMap;
  quizResults: Record<number, QuizResult>;
  profile: Profile;
}

export type LearningAction =
  | { type: "enroll"; id: number }
  | { type: "toggleFavorite"; id: number }
  | { type: "toggleLesson"; id: number; lesson: number }
  | { type: "saveQuizResult"; id: number; result: QuizResult }
  | { type: "updateProfile"; profile: Profile };

export function loadInitialState(): LearningState {
  return {
    enrolled: loadIdList(KEYS.enrolled),
    favorites: loadIdList(KEYS.favorites),
    completed: loadCompleted(),
    quizResults: loadQuizResults(),
    profile: loadProfile(),
  };
}

export function learningReducer(state: LearningState, action: LearningAction): LearningState {
  switch (action.type) {
    case "enroll":
      return state.enrolled.includes(action.id)
        ? state
        : { ...state, enrolled: [...state.enrolled, action.id] };
    case "toggleFavorite":
      return {
        ...state,
        favorites: state.favorites.includes(action.id)
          ? state.favorites.filter((f) => f !== action.id)
          : [...state.favorites, action.id],
      };
    case "toggleLesson": {
      // Lessons can only be ticked for enrolled courses.
      if (!state.enrolled.includes(action.id)) return state;
      const current = state.completed[action.id] ?? [];
      const next = current.includes(action.lesson)
        ? current.filter((l) => l !== action.lesson)
        : [...current, action.lesson].sort((a, b) => a - b);
      return { ...state, completed: { ...state.completed, [action.id]: next } };
    }
    case "saveQuizResult":
      return { ...state, quizResults: { ...state.quizResults, [action.id]: action.result } };
    case "updateProfile":
      return { ...state, profile: action.profile };
  }
}
