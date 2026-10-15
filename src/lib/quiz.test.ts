import { describe, expect, it } from "vitest";
import { quizzes } from "../data/quizzes";
import { initQuiz, QUIZ_SECONDS, quizReducer, quizSummary } from "./quiz";

const start = () => initQuiz(quizzes[1]); // correct answers: 1, 2, 2

describe("quizReducer", () => {
  it("starts on question 1 with 60 seconds", () => {
    const s = start();
    expect(s).toMatchObject({ current: 0, score: 0, selected: null, timeLeft: QUIZ_SECONDS, finished: false });
  });

  it("does not advance until an answer is selected", () => {
    const s = quizReducer(start(), { type: "next" });
    expect(s.current).toBe(0);
  });

  it("ignores out-of-range selections", () => {
    expect(quizReducer(start(), { type: "select", index: 9 }).selected).toBeNull();
  });

  it("scores right answers and moves on", () => {
    let s = quizReducer(start(), { type: "select", index: 1 });
    s = quizReducer(s, { type: "next" });
    expect(s).toMatchObject({ current: 1, score: 1, selected: null });
  });

  it("finishes after the last question", () => {
    let s = start();
    for (const pick of [1, 2, 0]) {
      s = quizReducer(s, { type: "select", index: pick });
      s = quizReducer(s, { type: "next" });
    }
    expect(s.finished).toBe(true);
    expect(quizSummary(s)).toEqual({ score: 2, total: 3, percentage: 67, passed: false });
  });

  it("passes at exactly 70% or more", () => {
    const s = { ...start(), score: 3, finished: true };
    expect(quizSummary(s).passed).toBe(true);
  });

  it("ends with the score so far when the timer runs out", () => {
    let s = quizReducer(start(), { type: "select", index: 1 });
    s = quizReducer(s, { type: "next" }); // 1 point
    for (let i = 0; i < QUIZ_SECONDS; i++) s = quizReducer(s, { type: "tick" });
    expect(s.finished).toBe(true);
    expect(s.timeLeft).toBe(0);
    expect(quizSummary(s).score).toBe(1);
  });

  it("ignores actions after the quiz has finished", () => {
    const done = { ...start(), finished: true };
    expect(quizReducer(done, { type: "select", index: 1 })).toBe(done);
  });
});
