import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { courses } from "../data/courses";
import {
  completedCoursesCount, courseProgress, getAchievements, overallProgress,
} from "../lib/progress";
import { useLearning } from "../state/LearningContext";
import { CourseCard } from "../components/CourseCard";
// Chart.js is large, so it only loads when the dashboard has something to plot.
const ProgressChart = lazy(() => import("../components/ProgressChart"));

const notifications = [
  { icon: "🎉", title: "Welcome to FusionLearn", text: "Your learning dashboard is ready." },
  { icon: "📚", title: "New courses available", text: "Explore the latest courses in our library." },
  { icon: "🏆", title: "Keep learning", text: "Complete lessons to unlock achievements." },
];

export default function Dashboard() {
  const { state } = useLearning();
  const enrolledCourses = courses.filter((c) => state.enrolled.includes(c.id));
  const favoriteCourses = courses.filter((c) => state.favorites.includes(c.id));
  const overall = overallProgress(courses, state.enrolled, state.completed);
  const done = completedCoursesCount(courses, state.enrolled, state.completed);
  const achievements = getAchievements(courses, state.enrolled, state.completed, state.quizResults);

  const stats = [
    { icon: "📚", value: enrolledCourses.length, label: "Enrolled Courses" },
    { icon: "❤️", value: favoriteCourses.length, label: "Favorites" },
    { icon: "🎯", value: `${overall}%`, label: "Overall Progress" },
    { icon: "🏆", value: done, label: "Completed Courses" },
  ];

  return (
    <>
      <section className="dashboard-welcome">
        <div>
          <p className="section-label">STUDENT DASHBOARD</p>
          <h1>Welcome back, {state.profile.name} 👋</h1>
          <p>Keep learning. You're making progress.</p>
        </div>
        <Link to="/courses" className="btn primary">Explore Courses</Link>
      </section>

      <section className="dashboard-stats">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span aria-hidden="true">{s.icon}</span>
            <div>
              <strong>{s.value}</strong>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-layout">
        <div className="content-card">
          <div className="section-heading">
            <div>
              <p className="section-label">ANALYTICS</p>
              <h2>Learning Progress</h2>
            </div>
          </div>
          <div className="chart-container">
            {enrolledCourses.length > 0 ? (
              <Suspense fallback={<p>Loading chart…</p>}>
                <ProgressChart
                  points={enrolledCourses.map((c) => ({
                    title: c.title,
                    progress: courseProgress(c, state.completed[c.id]),
                  }))}
                />
              </Suspense>
            ) : (
              <p>Enroll in a course to see your progress chart here.</p>
            )}
          </div>
        </div>

        <div className="content-card">
          <p className="section-label">ACHIEVEMENTS</p>
          <h2>Your Milestones</h2>
          <div className="achievement-list">
            {achievements.map((a) => (
              <div className={`achievement ${a.unlocked ? "unlocked" : ""}`} key={a.id} data-unlocked={a.unlocked}>
                <span aria-hidden="true">{a.icon}</span>
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.description}</p>
                  <span className="visually-hidden">{a.unlocked ? "Unlocked" : "Locked"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-label">KEEP GOING</p>
            <h2>Continue Learning</h2>
          </div>
        </div>
        {enrolledCourses.length > 0 ? (
          <div className="course-grid">
            {enrolledCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div aria-hidden="true">📚</div>
            <h3>No courses yet</h3>
            <p>Start your learning journey today.</p>
            <br />
            <Link to="/courses" className="btn primary">Explore Courses</Link>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-label">SAVED FOR LATER</p>
            <h2>Favorite Courses</h2>
          </div>
        </div>
        {favoriteCourses.length > 0 ? (
          <div className="course-grid">
            {favoriteCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div aria-hidden="true">❤️</div>
            <h3>No favorite courses yet</h3>
            <p>Save courses you want to learn later.</p>
          </div>
        )}
      </section>

      <section className="section">
        <div className="content-card">
          <p className="section-label">NOTIFICATIONS</p>
          <h2>Recent Updates</h2>
          <div className="notification-list">
            {notifications.map((n) => (
              <div className="notification" key={n.title}>
                <span aria-hidden="true">{n.icon}</span>
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
