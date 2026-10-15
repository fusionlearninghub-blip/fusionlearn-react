export type Category = "Mathematics" | "Physics" | "Programming" | "Science";
export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: number;
  title: string;
  category: Category;
  level: Level;
  instructor: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  price: number;
  icon: string;
  description: string;
  topics: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
}

export const GOALS = [
  "Academic Success",
  "Career Development",
  "Personal Development",
  "Exam Preparation",
] as const;
export type Goal = (typeof GOALS)[number];

export interface Profile {
  name: string;
  email: string;
  goal: Goal;
}

export type Theme = "light" | "dark";
