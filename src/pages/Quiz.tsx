import { useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourse } from "../data/courses";
import { getQuiz } from "../data/quizzes";
import { initQuiz, quizReducer, quizSummary } from "../lib/quiz";
import type { QuizQuestion } from "../types";
import { useLearning } from "../state/LearningContext";
import { useToast } from "../state/ToastContext";

function Unavailable() {
  return (
    <section className="section">
      <div className="quiz-container">
        <div className="empty-state">
          <h2>Quiz unavailable</h2>
          <Link to="/courses" className="btn primary">Back to Courses</Link>
        </div>
      </div>
    </section>
  );
}

function QuizRunner({
  courseId, title, questions, onRetry,
}: {
  courseId: number;
  title: string;
  questions: QuizQuestion[];
  onRetry: () => void;
}) {
  const [state, dispatch] = useReducer(quizReducer, questions, initQuiz);
  const { dispatch: learn } = useLearning();
  const toast = useToast();

  useEffect(() => {
    if (state.finished) return;
    const t = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(t);
  }, [state.finished]);

  const { finished } = state;
  useEffect(() => {
    if (!finished) return;
    const { score, total, percentage } = quizSummary(state);
    learn({ type: "saveQuizResult", id: courseId, result: { score, total, percentage } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (state.finished) {
    const s = quizSummary(state);
    return (
      <div className="quiz-result">
        <div className="result-icon" aria-hidden="true">{s.passed ? "🏆" : "📚"}</div>
        <p className="section-label">QUIZ COMPLETE</p>
        <h1>{s.passed ? "Excellent work!" : "Keep practicing!"}</h1>
        <div className="score">{s.percentage}%</div>
        <p>
          You scored <strong>{s.score}</strong> out of <strong>{s.total}</strong>.
        </p>
        <div className="result-actions">
          <button type="button" className="btn primary" onClick={onRetry}>Try Again</button>
          <Link to={`/course/${courseId}`} className="btn secondary">Back to Course</Link>
          <Link to="/dashboard" className="btn secondary">Dashboard</Link>
        </div>
      </div>
    );
  }

  const q = questions[state.current];
  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <div>
          <p className="section-label">{title}</p>
          <h1>Knowledge Quiz</h1>
        </div>
        <div className="timer" aria-label={`${state.timeLeft} seconds left`}>
          ⏱️ <span>{state.timeLeft}</span>s
        </div>
      </div>
      <div className="quiz-progress">
        <div style={{ width: `${((state.current + 1) / questions.length) * 100}%` }} />
      </div>
      <div>
        <div className="question-count">
          Question {state.current + 1} of {questions.length}
        </div>
        <h2 id="question-text">{q.question}</h2>
        <div className="quiz-options" role="group" aria-labelledby="question-text">
          {q.options.map((option, i) => (
            <button
              type="button"
              key={`${state.current}-${i}`}
              className={`quiz-option ${state.selected === i ? "selected" : ""}`}
              aria-pressed={state.selected === i}
              onClick={() => dispatch({ type: "select", index: i })}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="quiz-actions">
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            if (state.selected === null) toast("Please select an answer.");
            else dispatch({ type: "next" });
          }}
        >
          {state.current + 1 === questions.length ? "Finish Quiz" : "Next Question"}
        </button>
      </div>
    </div>
  );
}

export default function Quiz() {
  const { id } = useParams();
  const courseId = Number(id);
  const course = getCourse(courseId);
  const questions = getQuiz(courseId);
  const [attempt, setAttempt] = useState(0);

  if (!course || !questions) return <Unavailable />;
  return (
    <section className="section">
      <div className="quiz-container">
        <QuizRunner
          key={attempt}
          courseId={courseId}
          title={course.title}
          questions={questions}
          onRetry={() => setAttempt((a) => a + 1)}
        />
      </div>
    </section>
  );
}
