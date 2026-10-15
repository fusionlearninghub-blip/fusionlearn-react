import { act, fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderApp } from "./test/renderApp";

// jsdom has no canvas, so replace the chart with a plain element that exposes its data.
vi.mock("react-chartjs-2", () => ({
  Bar: ({ data }: { data: { labels: string[]; datasets: { data: number[] }[] } }) => (
    <div
      data-testid="chart"
      data-labels={JSON.stringify(data.labels)}
      data-values={JSON.stringify(data.datasets[0].data)}
    />
  ),
}));

const store = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));
const read = (key: string) => JSON.parse(localStorage.getItem(key) ?? "null");
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

afterEach(() => {
  vi.useRealTimers();
});

describe("home", () => {
  it("shows the hero, four features and three popular courses", () => {
    renderApp("/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Build skills that move you forward.");
    expect(screen.getAllByRole("heading", { level: 3, name: /Structured|Track|Practice|Learn Anywhere/ })).toHaveLength(4);
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("calculates lesson and course counts from the catalogue", () => {
    renderApp("/");
    expect(screen.getByText("117")).toBeInTheDocument(); // 24+20+18+15+28+12
    expect(screen.getByText("Courses", { selector: "small" })).toBeInTheDocument();
  });
});

describe("navigation", () => {
  it("shows My Learning on public pages, Profile on account pages and nothing on the quiz", () => {
    const { unmount } = renderApp("/courses");
    expect(screen.getByRole("link", { name: "My Learning" })).toBeInTheDocument();
    unmount();
    const second = renderApp("/dashboard");
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/profile");
    second.unmount();
    store("enrolledCourses", [1]);
    renderApp("/quiz/1");
    expect(screen.queryByRole("link", { name: /My Learning|Profile/ })).not.toBeInTheDocument();
  });

  it("marks Courses active on a course page", () => {
    renderApp("/course/2");
    expect(within(screen.getByRole("navigation", { name: "Main" })).getByRole("link", { name: "Courses" })).toHaveClass("active");
  });

  it("shows a friendly page for unknown routes", () => {
    renderApp("/nope");
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});

describe("courses page", () => {
  it("lists all six courses", () => {
    renderApp("/courses");
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });

  it("searches by title or description", async () => {
    const user = userEvent.setup();
    renderApp("/courses");
    await user.type(screen.getByLabelText("Search courses"), "algebra");
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent("Advanced Algebra");
  });

  it("filters by category and level", async () => {
    const user = userEvent.setup();
    renderApp("/courses");
    await user.selectOptions(screen.getByLabelText("Filter by category"), "Programming");
    expect(screen.getAllByRole("article")).toHaveLength(2);
    await user.selectOptions(screen.getByLabelText("Filter by level"), "Advanced");
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByRole("heading", { name: "No courses found" })).toBeInTheDocument();
  });

  it("favorites a course from its card and persists it", async () => {
    const user = userEvent.setup();
    renderApp("/courses");
    await user.click(screen.getByRole("button", { name: "Add GCSE Mathematics Mastery to favorites" }));
    expect(screen.getByRole("button", { name: "Remove GCSE Mathematics Mastery from favorites" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Added to favorites!")).toBeInTheDocument();
    expect(read("favorites")).toEqual([1]);
    await user.click(screen.getByRole("button", { name: "Remove GCSE Mathematics Mastery from favorites" }));
    expect(screen.getByText("Removed from favorites.")).toBeInTheDocument();
    expect(read("favorites")).toEqual([]);
  });

  it("shows progress and a Continue link only for enrolled courses", () => {
    store("enrolledCourses", [6]);
    store("completedLessons", { 6: range(6) });
    renderApp("/courses");
    const cards = screen.getAllByRole("article");
    const science = cards.find((c) => c.textContent?.includes("Introduction to Science"))!;
    expect(within(science).getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
    expect(within(science).getByRole("link", { name: "Continue" })).toBeInTheDocument();
    expect(screen.getAllByRole("progressbar")).toHaveLength(1);
  });
});

describe("course detail", () => {
  it("handles an unknown course", () => {
    renderApp("/course/99");
    expect(screen.getByRole("heading", { name: "Course not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Courses" })).toBeInTheDocument();
  });

  it("locks lessons and hides the quiz until you enrol", () => {
    renderApp("/course/1");
    expect(screen.getAllByRole("img", { name: /Locked/ })).toHaveLength(24);
    expect(screen.queryByRole("button", { name: /Complete/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Take Quiz" })).not.toBeInTheDocument();
    expect(screen.getByText("Algebra — Lesson 1")).toBeInTheDocument();
  });

  it("enrols, saves it, shows the toast and goes to the dashboard", async () => {
    const user = userEvent.setup();
    renderApp("/course/1");
    await user.click(screen.getAllByRole("button", { name: "Enroll Now" })[0]);
    expect(read("enrolledCourses")).toEqual([1]);
    expect(screen.getByRole("heading", { level: 1, name: /Welcome back/ })).toBeInTheDocument();
    expect(screen.getByText("Course added to your dashboard!")).toBeInTheDocument();
  });

  it("completing lessons updates progress and saves them", async () => {
    const user = userEvent.setup();
    store("enrolledCourses", [6]);
    renderApp("/course/6");
    const bar = () => screen.getByRole("progressbar", { name: "Course Progress" });
    expect(bar()).toHaveAttribute("aria-valuenow", "0");
    await user.click(screen.getByRole("button", { name: "Complete: Scientific Method lesson 1" }));
    expect(bar()).toHaveAttribute("aria-valuenow", "8");
    expect(screen.getByText("Lesson completed!")).toBeInTheDocument();
    expect(read("completedLessons")).toEqual({ 6: [1] });
    await user.click(screen.getByRole("button", { name: "Mark incomplete: Scientific Method lesson 1" }));
    expect(bar()).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText("Lesson marked incomplete.")).toBeInTheDocument();
  });

  it("shows the completed message at 100%", () => {
    store("enrolledCourses", [6]);
    store("completedLessons", { 6: range(12) });
    renderApp("/course/6");
    expect(screen.getByRole("heading", { name: /Course completed!/ })).toBeInTheDocument();
  });

  it("offers a quiz only where one exists", () => {
    store("enrolledCourses", [1, 4]);
    const { unmount } = renderApp("/course/1");
    expect(screen.getByRole("link", { name: "Take Quiz" })).toHaveAttribute("href", "/quiz/1");
    unmount();
    renderApp("/course/4");
    expect(screen.queryByRole("link", { name: "Take Quiz" })).not.toBeInTheDocument();
  });

  it("toggles the favorite button", async () => {
    const user = userEvent.setup();
    renderApp("/course/2");
    await user.click(screen.getByRole("button", { name: "♡ Add to Favorites" }));
    expect(screen.getByRole("button", { name: "❤️ Favorited" })).toBeInTheDocument();
    expect(read("favorites")).toEqual([2]);
  });
});

describe("quiz", () => {
  it("says when a course has no quiz", () => {
    renderApp("/quiz/4");
    expect(screen.getByRole("heading", { name: "Quiz unavailable" })).toBeInTheDocument();
  });

  it("asks for an answer before moving on", async () => {
    const user = userEvent.setup();
    renderApp("/quiz/1");
    await user.click(screen.getByRole("button", { name: "Next Question" }));
    expect(screen.getByText("Please select an answer.")).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
  });

  it("scores a perfect run, shows the result and saves it", async () => {
    const user = userEvent.setup();
    renderApp("/quiz/1");
    await user.click(screen.getByText("4"));
    await user.click(screen.getByRole("button", { name: "Next Question" }));
    expect(screen.getByText("Question 2 of 3")).toBeInTheDocument();
    await user.click(screen.getByText("40cm²"));
    await user.click(screen.getByRole("button", { name: "Next Question" }));
    await user.click(screen.getByText("50"));
    await user.click(screen.getByRole("button", { name: "Finish Quiz" }));
    expect(screen.getByText("QUIZ COMPLETE")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Excellent work!" })).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(read("quizResults")).toEqual({ 1: { score: 3, total: 3, percentage: 100 } });
  });

  it("encourages another try below 70% and Try Again restarts", async () => {
    const user = userEvent.setup();
    renderApp("/quiz/2");
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getAllByRole("button", { pressed: false }).find((b) => b.textContent?.startsWith("A"))!);
      await user.click(screen.getByRole("button", { name: /Next Question|Finish Quiz/ }));
    }
    expect(screen.getByRole("heading", { name: "Keep practicing!" })).toBeInTheDocument();
    expect(read("quizResults")[2]).toEqual({ score: 0, total: 3, percentage: 0 });
    await user.click(screen.getByRole("button", { name: "Try Again" }));
    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
  });

  it("counts down and ends the quiz when time runs out", () => {
    vi.useFakeTimers();
    renderApp("/quiz/3");
    expect(screen.getByText("60")).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(5000));
    expect(screen.getByText("55")).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(55000));
    expect(screen.getByText("QUIZ COMPLETE")).toBeInTheDocument();
    expect(read("quizResults")[3]).toEqual({ score: 0, total: 3, percentage: 0 });
  });

  it("a new result replaces the old one", async () => {
    const user = userEvent.setup();
    store("quizResults", { 1: { score: 3, total: 3, percentage: 100 } });
    renderApp("/quiz/1");
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByText(["2", "13cm²", "25"][i]));
      await user.click(screen.getByRole("button", { name: /Next Question|Finish Quiz/ }));
    }
    expect(read("quizResults")[1].percentage).toBe(0);
  });
});

describe("dashboard", () => {
  it("is empty for a new student", () => {
    renderApp("/dashboard");
    expect(screen.getByText("Welcome back, Student 👋")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No courses yet" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No favorite courses yet" })).toBeInTheDocument();
    expect(screen.queryByTestId("chart")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".achievement.unlocked")).toHaveLength(0);
  });

  it("shows stats, chart data and unlocked achievements from saved activity", async () => {
    store("enrolledCourses", [1, 6]);
    store("favorites", [3]);
    store("completedLessons", { 1: range(24), 6: range(6) });
    store("quizResults", { 1: { score: 3, total: 3, percentage: 100 } });
    renderApp("/dashboard");
    const stat = (label: string) => screen.getByText(label).previousElementSibling;
    expect(stat("Enrolled Courses")).toHaveTextContent("2");
    expect(stat("Favorites")).toHaveTextContent("1");
    expect(stat("Overall Progress")).toHaveTextContent("75%");
    expect(stat("Completed Courses")).toHaveTextContent("1");
    const chart = await screen.findByTestId("chart");
    expect(JSON.parse(chart.dataset.labels!)).toEqual(["GCSE Mathematics Mastery", "Introduction to Science"]);
    expect(JSON.parse(chart.dataset.values!)).toEqual([100, 50]);
    expect(document.querySelectorAll(".achievement.unlocked")).toHaveLength(4);
    expect(screen.getAllByRole("heading", { name: "JavaScript for Beginners" })).toHaveLength(1); // favorites list
  });

  it("only unlocks achievements that were earned", () => {
    store("enrolledCourses", [1]);
    renderApp("/dashboard");
    const unlocked = [...document.querySelectorAll(".achievement.unlocked")].map((a) => a.querySelector("strong")?.textContent);
    expect(unlocked).toEqual(["First Course"]);
  });
});

describe("profile", () => {
  it("shows the default profile with the first initial", () => {
    renderApp("/profile");
    expect(screen.getByText("S", { selector: ".avatar span" })).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name")).toHaveValue("Student");
    expect(screen.getByLabelText("Email")).toHaveValue("student@example.com");
  });

  it("saves edits, updates the card and persists them", async () => {
    const user = userEvent.setup();
    renderApp("/profile");
    await user.clear(screen.getByLabelText("Full Name"));
    await user.type(screen.getByLabelText("Full Name"), "ada Lovelace");
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.selectOptions(screen.getByLabelText("Learning Goal"), "Exam Preparation");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(screen.getByText("Profile updated successfully!")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "ada Lovelace" })).toBeInTheDocument();
    expect(screen.getByText("A", { selector: ".avatar span" })).toBeInTheDocument();
    expect(read("studentProfile")).toEqual({ name: "ada Lovelace", email: "ada@example.com", goal: "Exam Preparation" });
  });

  it("blocks an empty name and a bad email", async () => {
    const user = userEvent.setup();
    renderApp("/profile");
    await user.clear(screen.getByLabelText("Full Name"));
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(await screen.findByText("Please enter your name")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
    expect(read("studentProfile")).toEqual({ name: "Student", email: "student@example.com", goal: "Academic Success" });
  });

  it("the dashboard greets the saved name", () => {
    store("studentProfile", { name: "Kingsley", email: "k@x.com", goal: "Career Development" });
    renderApp("/dashboard");
    expect(screen.getByText("Welcome back, Kingsley 👋")).toBeInTheDocument();
  });
});

describe("theme", () => {
  it("toggles dark mode on the body and remembers it", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(document.body).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toHaveTextContent("☀️");
    await user.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(document.body).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("starts dark when saved as dark", () => {
    localStorage.setItem("theme", "dark");
    renderApp("/");
    expect(document.body).toHaveClass("dark");
  });
});

describe("saved data safety", () => {
  it("does not crash on corrupt saved data", () => {
    for (const k of ["enrolledCourses", "favorites", "completedLessons", "quizResults", "studentProfile"])
      localStorage.setItem(k, "{{{");
    renderApp("/dashboard");
    expect(screen.getByText("Welcome back, Student 👋")).toBeInTheDocument();
  });

  it("ignores saved lessons for courses the student is not enrolled in", () => {
    store("completedLessons", { 1: [1, 2, 3] });
    renderApp("/dashboard");
    expect(screen.getByText("Overall Progress").previousElementSibling).toHaveTextContent("0%");
  });
});

describe("search box", () => {
  it("is case-insensitive", () => {
    renderApp("/courses");
    fireEvent.change(screen.getByLabelText("Search courses"), { target: { value: "PHYSICS" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });
});

describe("browser quirks", () => {
  it("still renders if window.scrollTo returns a value (some browsers/polyfills do)", () => {
    const original = window.scrollTo;
    window.scrollTo = vi.fn(() => "not-a-cleanup-function") as unknown as typeof window.scrollTo;
    try {
      renderApp("/");
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Build skills");
    } finally {
      window.scrollTo = original;
    }
  });
});
