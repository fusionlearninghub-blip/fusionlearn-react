import { Link } from "react-router-dom";
import type { Course } from "../types";
import { courseProgress } from "../lib/progress";
import { useLearning } from "../state/LearningContext";
import { useToast } from "../state/ToastContext";
import { ProgressBar } from "./ProgressBar";

export function CourseCard({ course }: { course: Course }) {
  const { state, dispatch } = useLearning();
  const toast = useToast();
  const enrolled = state.enrolled.includes(course.id);
  const favorite = state.favorites.includes(course.id);

  function onFavorite() {
    dispatch({ type: "toggleFavorite", id: course.id });
    toast(favorite ? "Removed from favorites." : "Added to favorites!");
  }

  return (
    <article className="course-card">
      <div className="course-image">
        <span className="course-icon" aria-hidden="true">{course.icon}</span>
        <button
          type="button"
          className="favorite-btn"
          aria-label={`${favorite ? "Remove" : "Add"} ${course.title} ${favorite ? "from" : "to"} favorites`}
          aria-pressed={favorite}
          onClick={onFavorite}
        >
          {favorite ? "❤️" : "♡"}
        </button>
      </div>
      <div className="course-content">
        <div className="course-meta">
          <span>{course.category}</span>
          <span>{course.level}</span>
        </div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-info">
          <span>⭐ {course.rating}</span>
          <span>👥 {course.students}</span>
          <span>🕐 {course.duration}</span>
        </div>
        {enrolled && <ProgressBar label="Progress" value={courseProgress(course, state.completed[course.id])} />}
        <div className="course-footer">
          <strong>${course.price}</strong>
          <Link to={`/course/${course.id}`} className="small-btn">
            {enrolled ? "Continue" : "View Course"}
          </Link>
        </div>
      </div>
    </article>
  );
}
