import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_PROFILE, KEYS, loadCompleted, loadIdList, loadProfile, loadQuizResults,
  loadTheme, saveTheme, writeJson,
} from "./storage";

describe("storage validation", () => {
  it("falls back to empty values when nothing is stored", () => {
    expect(loadIdList(KEYS.enrolled)).toEqual([]);
    expect(loadCompleted()).toEqual({});
    expect(loadQuizResults()).toEqual({});
    expect(loadProfile()).toEqual(DEFAULT_PROFILE);
    expect(loadTheme()).toBe("light");
  });

  it("survives corrupt JSON", () => {
    for (const k of Object.values(KEYS)) localStorage.setItem(k, "{not json");
    expect(loadIdList(KEYS.favorites)).toEqual([]);
    expect(loadCompleted()).toEqual({});
    expect(loadQuizResults()).toEqual({});
    expect(loadProfile()).toEqual(DEFAULT_PROFILE);
  });

  it("keeps only valid, unique positive integers in id lists", () => {
    localStorage.setItem(KEYS.enrolled, JSON.stringify([1, 1, "2", 3.5, -1, null, 4]));
    expect(loadIdList(KEYS.enrolled)).toEqual([1, 4]);
    localStorage.setItem(KEYS.enrolled, JSON.stringify({ not: "an array" }));
    expect(loadIdList(KEYS.enrolled)).toEqual([]);
  });

  it("cleans completed lessons", () => {
    localStorage.setItem(KEYS.completed, JSON.stringify({ 1: [3, 1, 1, "x"], abc: [1], 2: "nope" }));
    expect(loadCompleted()).toEqual({ 1: [1, 3] });
  });

  it("rejects impossible quiz results", () => {
    localStorage.setItem(
      KEYS.quizResults,
      JSON.stringify({
        1: { score: 2, total: 3, percentage: 67 },
        2: { score: 5, total: 3, percentage: 100 },
        3: { score: 1, total: 3, percentage: 400 },
        4: "bad",
      }),
    );
    expect(loadQuizResults()).toEqual({ 1: { score: 2, total: 3, percentage: 67 } });
  });

  it("repairs a partly invalid profile field by field", () => {
    localStorage.setItem(KEYS.profile, JSON.stringify({ name: "Ada", email: 5, goal: "World Domination" }));
    expect(loadProfile()).toEqual({ name: "Ada", email: DEFAULT_PROFILE.email, goal: DEFAULT_PROFILE.goal });
  });

  it("reads and writes the theme as a plain string like the original app", () => {
    saveTheme("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(loadTheme()).toBe("dark");
    localStorage.setItem("theme", "purple");
    expect(loadTheme()).toBe("light");
  });

  it("does not throw when storage is blocked", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => writeJson("x", 1)).not.toThrow();
    expect(() => saveTheme("dark")).not.toThrow();
    spy.mockRestore();
  });
});
