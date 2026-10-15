import { Link } from "react-router-dom";
import { courses } from "../data/courses";
import { CourseCard } from "../components/CourseCard";

const features = [
  { icon: "📖", title: "Structured Learning", text: "Follow carefully organized lessons from beginner to advanced levels." },
  { icon: "🎯", title: "Track Progress", text: "Monitor your learning progress and see exactly how far you've come." },
  { icon: "🧠", title: "Practice & Quiz", text: "Test your knowledge with practical quizzes and improve your understanding." },
  { icon: "📱", title: "Learn Anywhere", text: "Access your courses from your computer, tablet or mobile phone." },
];

export default function Home() {
  const lessonCount = courses.reduce((sum, c) => sum + c.lessons, 0);
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="badge">🚀 Learn smarter. Grow faster.</p>
          <h1>
            Build skills that <span>move you forward.</span>
          </h1>
          <p className="hero-text">
            Learn Mathematics, Physics, Programming and other valuable skills through structured
            courses and practical learning.
          </p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn primary">Explore Courses</Link>
            <Link to="/dashboard" className="btn secondary">My Dashboard</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="floating-card card-one">
            <span aria-hidden="true">📚</span>
            <div>
              {/* Calculated from the catalogue instead of the old hard-coded "50+" */}
              <strong>{lessonCount}</strong>
              <small>Lessons</small>
            </div>
          </div>
          <div className="learning-illustration" aria-hidden="true">🎓</div>
          <div className="floating-card card-two">
            <span aria-hidden="true">🏆</span>
            <div>
              <strong>{courses.length}</strong>
              <small>Courses</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-label">WHY FUSIONLEARN?</p>
            <h2>A better way to learn</h2>
          </div>
        </div>
        <div className="features">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon" aria-hidden="true">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-label">START LEARNING</p>
            <h2>Popular Courses</h2>
          </div>
          <Link to="/courses" className="view-link">View all →</Link>
        </div>
        <div className="course-grid">
          {courses.slice(0, 3).map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      <section className="cta">
        <div>
          <p className="section-label">READY TO START?</p>
          <h2>Your next skill could change your future.</h2>
          <p>Choose a course and start learning today.</p>
        </div>
        <Link to="/courses" className="btn primary">Browse Courses</Link>
      </section>
    </>
  );
}
