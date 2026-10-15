import { useMemo, useState } from "react";
import { courses } from "../data/courses";
import { filterCourses } from "../lib/progress";
import { CourseCard } from "../components/CourseCard";

export default function Courses() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");

  const visible = useMemo(
    () => filterCourses(courses, { query, category, level }),
    [query, category, level],
  );

  return (
    <>
      <section className="page-header">
        <p className="section-label">LEARNING LIBRARY</p>
        <h1>Explore Courses</h1>
        <p>Choose a course, start learning and track your progress.</p>
      </section>

      <section className="course-controls">
        <div className="search-box">
          <span aria-hidden="true">🔎</span>
          <input
            type="text"
            aria-label="Search courses"
            placeholder="Search courses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Programming">Programming</option>
          <option value="Science">Science</option>
        </select>
        <select aria-label="Filter by level" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </section>

      <section className="section">
        <p className="visually-hidden" role="status">
          {visible.length} {visible.length === 1 ? "course" : "courses"} found
        </p>
        {visible.length > 0 ? (
          <div className="course-grid">
            {visible.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div aria-hidden="true">🔍</div>
            <h3>No courses found</h3>
            <p>Try another search term or category.</p>
          </div>
        )}
      </section>
    </>
  );
}
