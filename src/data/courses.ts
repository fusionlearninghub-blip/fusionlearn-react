import type { Course } from "../types";

// Sample catalogue. Student counts and ratings are demo data, not real analytics.
export const courses: Course[] = [
  {
    id: 1,
    title: "GCSE Mathematics Mastery",
    category: "Mathematics",
    level: "Intermediate",
    instructor: "Kingsley Osayande",
    duration: "12 hours",
    lessons: 24,
    students: 245,
    rating: 4.9,
    price: 49,
    icon: "📐",
    description:
      "Master the essential GCSE Mathematics topics through clear explanations, worked examples and exam-style practice.",
    topics: ["Algebra", "Geometry", "Statistics", "Probability", "Sequences", "Graphs"],
  },
  {
    id: 2,
    title: "GCSE Physics Fundamentals",
    category: "Physics",
    level: "Intermediate",
    instructor: "Kingsley Osayande",
    duration: "10 hours",
    lessons: 20,
    students: 198,
    rating: 4.8,
    price: 45,
    icon: "⚡",
    description:
      "Understand the core concepts of GCSE Physics with simple explanations and practical examples.",
    topics: ["Forces", "Energy", "Electricity", "Waves", "Particles", "Atomic Structure"],
  },
  {
    id: 3,
    title: "JavaScript for Beginners",
    category: "Programming",
    level: "Beginner",
    instructor: "FusionLearn Team",
    duration: "8 hours",
    lessons: 18,
    students: 321,
    rating: 4.9,
    price: 39,
    icon: "💻",
    description:
      "Learn JavaScript from the ground up and build interactive websites using real programming concepts.",
    topics: ["Variables", "Functions", "Arrays", "Objects", "DOM", "Events"],
  },
  {
    id: 4,
    title: "HTML & CSS Professional",
    category: "Programming",
    level: "Beginner",
    instructor: "FusionLearn Team",
    duration: "6 hours",
    lessons: 15,
    students: 275,
    rating: 4.7,
    price: 29,
    icon: "🎨",
    description:
      "Build beautiful responsive websites using modern HTML and CSS techniques.",
    topics: ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive Design", "Animations"],
  },
  {
    id: 5,
    title: "Advanced Algebra",
    category: "Mathematics",
    level: "Advanced",
    instructor: "Kingsley Osayande",
    duration: "14 hours",
    lessons: 28,
    students: 142,
    rating: 4.9,
    price: 59,
    icon: "🧮",
    description:
      "Take your algebra skills to an advanced level with challenging problems and detailed solutions.",
    topics: ["Quadratics", "Functions", "Inequalities", "Polynomials", "Logarithms", "Sequences"],
  },
  {
    id: 6,
    title: "Introduction to Science",
    category: "Science",
    level: "Beginner",
    instructor: "FusionLearn Team",
    duration: "5 hours",
    lessons: 12,
    students: 187,
    rating: 4.6,
    price: 25,
    icon: "🔬",
    description:
      "Explore fundamental scientific concepts and discover how science explains the world around us.",
    topics: ["Scientific Method", "Matter", "Energy", "Cells", "Forces", "Earth Science"],
  },
];

export function getCourse(id: number): Course | undefined {
  return courses.find((c) => c.id === id);
}
