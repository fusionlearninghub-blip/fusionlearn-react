import { GOALS } from "../types";
import type { Goal, Profile, QuizResult, Theme } from "../types";
import type { CompletedMap } from "./progress";

export const KEYS = {
  enrolled: "enrolledCourses",
  favorites: "favorites",
  completed: "completedLessons",
  quizResults: "quizResults",
  theme: "theme",
  profile: "studentProfile",
} as const;

export const DEFAULT_PROFILE: Profile = {
  name: "Student",
  email: "student@example.com",
  goal: "Academic Success",
};

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: the app keeps working in memory */
  }
}

const isPosInt = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v > 0;
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function loadIdList(key: string): number[] {
  const raw = readJson(key);
  return Array.isArray(raw) ? [...new Set(raw.filter(isPosInt))] : [];
}

export function loadCompleted(): CompletedMap {
  const raw = readJson(KEYS.completed);
  const out: CompletedMap = {};
  if (!isRecord(raw)) return out;
  for (const [k, v] of Object.entries(raw)) {
    const id = Number(k);
    if (!isPosInt(id) || !Array.isArray(v)) continue;
    out[id] = [...new Set(v.filter(isPosInt))].sort((a, b) => a - b);
  }
  return out;
}

export function loadQuizResults(): Record<number, QuizResult> {
  const raw = readJson(KEYS.quizResults);
  const out: Record<number, QuizResult> = {};
  if (!isRecord(raw)) return out;
  for (const [k, v] of Object.entries(raw)) {
    const id = Number(k);
    if (!isPosInt(id) || !isRecord(v)) continue;
    const { score, total, percentage } = v;
    if (
      typeof score === "number" && Number.isFinite(score) && score >= 0 &&
      isPosInt(total) && score <= total &&
      typeof percentage === "number" && percentage >= 0 && percentage <= 100
    ) {
      out[id] = { score, total, percentage };
    }
  }
  return out;
}

export function loadProfile(): Profile {
  const raw = readJson(KEYS.profile);
  if (!isRecord(raw)) return { ...DEFAULT_PROFILE };
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name : DEFAULT_PROFILE.name;
  const email = typeof raw.email === "string" && raw.email.trim() ? raw.email : DEFAULT_PROFILE.email;
  const goal: Goal = GOALS.includes(raw.goal as Goal) ? (raw.goal as Goal) : DEFAULT_PROFILE.goal;
  return { name, email, goal };
}

/** Theme was stored as a plain string ("dark"/"light") by the original app. */
export function loadTheme(): Theme {
  try {
    return localStorage.getItem(KEYS.theme) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(KEYS.theme, theme);
  } catch {
    /* ignore */
  }
}
