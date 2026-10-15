import { describe, expect, it } from "vitest";
import { DEFAULT_PROFILE } from "../lib/storage";
import { learningReducer, type LearningState } from "./learningReducer";

const empty = (): LearningState => ({
  enrolled: [], favorites: [], completed: {}, quizResults: {}, profile: DEFAULT_PROFILE,
});

describe("learningReducer", () => {
  it("enrols once only", () => {
    let s = learningReducer(empty(), { type: "enroll", id: 2 });
    s = learningReducer(s, { type: "enroll", id: 2 });
    expect(s.enrolled).toEqual([2]);
  });

  it("toggles favorites on and off", () => {
    let s = learningReducer(empty(), { type: "toggleFavorite", id: 3 });
    expect(s.favorites).toEqual([3]);
    s = learningReducer(s, { type: "toggleFavorite", id: 3 });
    expect(s.favorites).toEqual([]);
  });

  it("toggles lessons for enrolled courses, keeping them sorted", () => {
    let s = learningReducer(empty(), { type: "enroll", id: 1 });
    s = learningReducer(s, { type: "toggleLesson", id: 1, lesson: 5 });
    s = learningReducer(s, { type: "toggleLesson", id: 1, lesson: 2 });
    expect(s.completed[1]).toEqual([2, 5]);
    s = learningReducer(s, { type: "toggleLesson", id: 1, lesson: 5 });
    expect(s.completed[1]).toEqual([2]);
  });

  it("refuses to complete lessons in a course you have not enrolled in", () => {
    const s = empty();
    expect(learningReducer(s, { type: "toggleLesson", id: 1, lesson: 1 })).toBe(s);
  });

  it("overwrites an earlier quiz result for the same course", () => {
    let s = learningReducer(empty(), { type: "saveQuizResult", id: 1, result: { score: 3, total: 3, percentage: 100 } });
    s = learningReducer(s, { type: "saveQuizResult", id: 1, result: { score: 1, total: 3, percentage: 33 } });
    expect(s.quizResults[1]).toEqual({ score: 1, total: 3, percentage: 33 });
  });

  it("updates the profile", () => {
    const profile = { name: "Ada", email: "ada@x.com", goal: "Exam Preparation" as const };
    expect(learningReducer(empty(), { type: "updateProfile", profile }).profile).toEqual(profile);
  });
});
