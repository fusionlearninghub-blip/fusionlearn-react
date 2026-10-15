import {
  createContext, useContext, useEffect, useMemo, useReducer,
  type Dispatch, type ReactNode,
} from "react";
import {
  learningReducer, loadInitialState, type LearningAction, type LearningState,
} from "./learningReducer";
import { KEYS, writeJson } from "../lib/storage";

interface Ctx {
  state: LearningState;
  dispatch: Dispatch<LearningAction>;
}

const LearningContext = createContext<Ctx | null>(null);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learningReducer, undefined, loadInitialState);

  useEffect(() => {
    writeJson(KEYS.enrolled, state.enrolled);
  }, [state.enrolled]);
  useEffect(() => {
    writeJson(KEYS.favorites, state.favorites);
  }, [state.favorites]);
  useEffect(() => {
    writeJson(KEYS.completed, state.completed);
  }, [state.completed]);
  useEffect(() => {
    writeJson(KEYS.quizResults, state.quizResults);
  }, [state.quizResults]);
  useEffect(() => {
    writeJson(KEYS.profile, state.profile);
  }, [state.profile]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning(): Ctx {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error("useLearning must be used inside <LearningProvider>");
  return ctx;
}
