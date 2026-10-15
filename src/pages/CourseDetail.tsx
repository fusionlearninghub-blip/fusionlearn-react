import { Link, useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../data/courses";
import { getQuiz } from "../data/quizzes";
import { courseProgress, lessonTopic } from "../lib/progress";
import { useLearning } from "../state/LearningContext";
import { useToast } from "../state/ToastContext";
import { ProgressBar } from "../components/ProgressBar";

export default function CourseDetail() {
  const { id } = useParams();
  const course = getCourse(Number(id));
  const { state, dispatch } = useLearning();
  const toast = useToast();
  const navigate = useNavigate();

  if (!course) {
    return (
      <section className="section">
        <div className="empty-state">
          <h2>Course not found</h2>
          <Link to="/courses" className="btn primary">Back to Courses</Link>
        </div>
      </section>
    );
  }

  const enrolled = state.enrolled.includes(course.id);
  const favorite = state.favorites.includes(course.id);
  const completed = state.completed[course.id] ?? [];
  const progress = courseProgress(course, completed);
  const hasQuiz = getQuiz(course.id) !== undefined;

  function enroll() {
    if (!enrolled) {
      dispatch({ type: "enroll", id: course!.id });
      toast("Course added to your dashboard!");
    }
    navigate("/dashboard");
  }

  function toggleFavorite() {
    dispatch({ type: "toggleFavorite", id: course!.id });
    toast(favorite ? "Removed from favorites." : "Added to favorites!");
  }

  function toggleLesson(lesson: number) {
    const done = completed.includes(lesson);
    dispatch({ type: "toggleLesson", id: course!.id, lesson });
    toast(done ? "Lesson marked incomplete." : "Lesson completed!");
  }

  const enrollLabel = enrolled ? "Continue Learning" : "Enroll Now";

  return (
    <>
      <section className="course-hero">
        <div className="course-hero-icon" aria-hidden="true">{course.icon}</div>
        <div className="course-hero-content">
          <div className="course-meta">
            <span>{course.category}</span>
            <span>{course.level}</span>
          </div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="course-info large">
            <span>⭐ {course.rating}</span>
            <span>👥 {course.students}</span>
            <span>🕐 {course.duration}</span>
            <span>📚 {course.lessons} lessons</span>
          </div>
          {enrolled && <ProgressBar label="Course Progress" value={progress} />}
          <div className="detail-actions">
            <button type="button" className="btn primary" onClick={enroll}>{enrollLabel}</button>
            <button type="button" className="btn secondary" aria-pressed={favorite} onClick={toggleFavorite}>
              {favorite ? "❤️ Favorited" : "♡ Add to Favorites"}
            </button>
          </div>
        </div>
      </section>

      <section className="section course-detail-layout">
        <div>
          <div className="content-card">
            <p className="section-label">WHAT YOU'LL LEARN</p>
            <h2>Course Topics</h2>
            <div className="topic-grid">
              {course.topics.map((t) => (
                <div className="topic" key={t}>
                  <span aria-hidden="true">✓</span> {t}
                </div>
              ))}
            </div>
          </div>

          <div className="content-card">
            <p className="section-label">COURSE CONTENT</p>
            <h2>Lessons</h2>
            {Array.from({ length: course.lessons }, (_, i) => {
              const n = i + 1;
              const done = completed.includes(n);
              return (
                <div className="lesson" key={n}>
                  <span className="lesson-number">{n}</span>
                  <div>
                    <strong>{lessonTopic(course, n)} — Lesson {n}</strong>
                    <p>Video lesson and practice exercises</p>
                  </div>
                  {enrolled ? (
                    <button
                      type="button"
                      className={`lesson-btn ${done ? "completed" : ""}`}
                      aria-pressed={done}
                      aria-label={`${done ? "Mark incomplete" : "Complete"}: ${lessonTopic(course, n)} lesson ${n}`}
                      onClick={() => toggleLesson(n)}
                    >
                      {done ? "✓ Done" : "Complete"}
                    </button>
                  ) : (
                    <span role="img" aria-label="Locked until you enroll">🔒</span>
                  )}
                </div>
              );
            })}
          </div>

          {enrolled && hasQuiz && (
            <div className="content-card quiz-callout">
              <div>
                <p className="section-label">TEST YOUR KNOWLEDGE</p>
                <h2>Ready for a quiz?</h2>
                <p>Test what you've learned and see your score.</p>
              </div>
              <Link to={`/quiz/${course.id}`} className="btn primary">Take Quiz</Link>
            </div>
          )}
        </div>

        <aside className="enroll-card">
          <div className="enroll-icon" aria-hidden="true">{course.icon}</div>
          <h2>{progress === 100 ? "Course completed! 🎉" : "Start learning today"}</h2>
          <p>Get access to all {course.lessons} lessons and track your progress.</p>
          <div className="price">${course.price}</div>
          <button type="button" className="btn primary full" onClick={enroll}>{enrollLabel}</button>
        </aside>
      </section>
    </>
  );
}
