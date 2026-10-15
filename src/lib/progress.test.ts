import { describe, expect, it } from "vitest";
import { courses } from "../data/courses";
import {
  completedCoursesCount, courseProgress, filterCourses, getAchievements,
  lessonTopic, overallProgress, scoreQuiz, toPercentage,
} from "./progress";
import { quizzes } from "../data/quizzes";

const maths = courses[0]; // 24 lessons
const science = courses[5]; // 12 lessons
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

describe("courseProgress", () => {
  it("is 0 with no completed lessons", () => {
    expect(courseProgress(maths, undefined)).toBe(0);
    expect(courseProgress(maths, [])).toBe(0);
  });
  it("rounds completed / total to a whole percent", () => {
    expect(courseProgress(maths, [1])).toBe(4); // 1/24 = 4.17
    expect(courseProgress(maths, range(12))).toBe(50);
  });
  it("reaches 100 only when every lesson is done", () => {
    expect(courseProgress(maths, range(24))).toBe(100);
  });
  it("ignores duplicates and lesson numbers that do not exist", () => {
    expect(courseProgress(science, [1, 1, 1, 99, 0, -2])).toBe(8); // only lesson 1 counts: 1/12
  });
});

describe("overall progress and completion", () => {
  it("is 0 when nothing is enrolled", () => {
    expect(overallProgress(courses, [], {})).toBe(0);
  });
  it("averages only the enrolled courses", () => {
    const completed = { 1: range(24), 6: range(6) }; // 100% and 50%
    expect(overallProgress(courses, [1, 6], completed)).toBe(75);
    expect(overallProgress(courses, [1], completed)).toBe(100);
  });
  it("counts completed courses only if enrolled", () => {
    const completed = { 1: range(24), 6: range(12) };
    expect(completedCoursesCount(courses, [1, 6], completed)).toBe(2);
    expect(completedCoursesCount(courses, [6], completed)).toBe(1);
  });
});

describe("achievements", () => {
  const unlocked = (list: ReturnType<typeof getAchievements>) =>
    list.filter((a) => a.unlocked).map((a) => a.title);

  it("starts with nothing unlocked", () => {
    expect(unlocked(getAchievements(courses, [], {}, {}))).toEqual([]);
  });
  it("unlocks First Course, First Lesson, Quiz Master and Graduate from real activity", () => {
    expect(unlocked(getAchievements(courses, [6], {}, {}))).toEqual(["First Course"]);
    expect(unlocked(getAchievements(courses, [6], { 6: [1] }, {}))).toEqual(["First Course", "First Lesson"]);
    expect(
      unlocked(getAchievements(courses, [1], {}, { 1: { score: 2, total: 3, percentage: 67 } })),
    ).toEqual(["First Course"]); // 67% is below the 70% pass mark
    expect(
      unlocked(getAchievements(courses, [1], {}, { 1: { score: 3, total: 3, percentage: 100 } })),
    ).toEqual(["First Course", "Quiz Master"]);
    expect(unlocked(getAchievements(courses, [6], { 6: range(12) }, {}))).toEqual([
      "First Course", "First Lesson", "Graduate",
    ]);
  });
});

describe("lessonTopic", () => {
  it("cycles through the course topics", () => {
    expect(lessonTopic(maths, 1)).toBe("Algebra");
    expect(lessonTopic(maths, 6)).toBe("Graphs");
    expect(lessonTopic(maths, 7)).toBe("Algebra");
  });
});

describe("filterCourses", () => {
  const all = { query: "", category: "all", level: "all" };
  it("returns everything with no filters", () => {
    expect(filterCourses(courses, all)).toHaveLength(6);
  });
  it("searches titles and descriptions, ignoring case and surrounding spaces", () => {
    expect(filterCourses(courses, { ...all, query: "  JAVASCRIPT " }).map((c) => c.id)).toEqual([3]);
    expect(filterCourses(courses, { ...all, query: "worked examples" }).map((c) => c.id)).toEqual([1]);
  });
  it("filters by category and level together", () => {
    expect(filterCourses(courses, { ...all, category: "Mathematics" }).map((c) => c.id)).toEqual([1, 5]);
    expect(filterCourses(courses, { ...all, category: "Mathematics", level: "Advanced" }).map((c) => c.id)).toEqual([5]);
    expect(filterCourses(courses, { ...all, category: "Physics", level: "Beginner" })).toEqual([]);
  });
});

describe("quiz scoring", () => {
  it("scores correct answers and ignores unanswered ones", () => {
    const qs = quizzes[1]; // answers 1, 2, 2
    expect(scoreQuiz(qs, [1, 2, 2])).toEqual({ score: 3, total: 3, percentage: 100 });
    expect(scoreQuiz(qs, [1, 0, null])).toEqual({ score: 1, total: 3, percentage: 33 });
  });
  it("handles zero questions", () => {
    expect(toPercentage(0, 0)).toBe(0);
  });
});

describe("quiz data", () => {
  it("every question has a valid answer index", () => {
    for (const qs of Object.values(quizzes))
      for (const q of qs) {
        expect(q.options).toHaveLength(4);
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
      }
  });
});
