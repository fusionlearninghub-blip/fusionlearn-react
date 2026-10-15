import type { Course, QuizQuestion, QuizResult } from "../types";

export const PASS_MARK = 70;

export type CompletedMap = Record<number, number[]>;

/** Lesson numbers that exist in the course, de-duplicated. */
function validLessons(course: Course, completed: number[] | undefined): number[] {
  if (!completed) return [];
  return [...new Set(completed)].filter(
    (n) => Number.isInteger(n) && n >= 1 && n <= course.lessons,
  );
}

export function courseProgress(course: Course, completed: number[] | undefined): number {
  if (course.lessons <= 0) return 0;
  return Math.round((validLessons(course, completed).length / course.lessons) * 100);
}

export function overallProgress(
  courses: Course[],
  enrolled: number[],
  completed: CompletedMap,
): number {
  const mine = courses.filter((c) => enrolled.includes(c.id));
  if (mine.length === 0) return 0;
  const total = mine.reduce((sum, c) => sum + courseProgress(c, completed[c.id]), 0);
  return Math.round(total / mine.length);
}

export function completedCoursesCount(
  courses: Course[],
  enrolled: number[],
  completed: CompletedMap,
): number {
  return courses.filter(
    (c) => enrolled.includes(c.id) && courseProgress(c, completed[c.id]) === 100,
  ).length;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export function getAchievements(
  courses: Course[],
  enrolled: number[],
  completed: CompletedMap,
  results: Record<number, QuizResult>,
): Achievement[] {
  const anyLesson = Object.values(completed).some((l) => l.length > 0);
  const quizMaster = Object.values(results).some((r) => r.percentage >= PASS_MARK);
  return [
    { id: "first-course", icon: "🚀", title: "First Course", description: "Enroll in your first course", unlocked: enrolled.length > 0 },
    { id: "first-lesson", icon: "📖", title: "First Lesson", description: "Complete your first lesson", unlocked: anyLesson },
    { id: "quiz-master", icon: "🏆", title: "Quiz Master", description: "Score 70% or higher", unlocked: quizMaster },
    {
      id: "graduate",
      icon: "🎓",
      title: "Graduate",
      description: "Complete a course",
      unlocked: completedCoursesCount(courses, enrolled, completed) > 0,
    },
  ];
}

export function lessonTopic(course: Course, lessonNumber: number): string {
  return course.topics[(lessonNumber - 1) % course.topics.length];
}

export interface CourseFilter {
  query: string;
  category: string;
  level: string;
}

export function filterCourses(courses: Course[], f: CourseFilter): Course[] {
  const q = f.query.trim().toLowerCase();
  return courses.filter((c) => {
    const matchesQuery =
      q === "" || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchesCategory = f.category === "all" || c.category === f.category;
    const matchesLevel = f.level === "all" || c.level === f.level;
    return matchesQuery && matchesCategory && matchesLevel;
  });
}

export function toPercentage(score: number, total: number): number {
  return total === 0 ? 0 : Math.round((score / total) * 100);
}

export function scoreQuiz(questions: QuizQuestion[], answers: (number | null)[]): QuizResult {
  const score = questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
  return { score, total: questions.length, percentage: toPercentage(score, questions.length) };
}
