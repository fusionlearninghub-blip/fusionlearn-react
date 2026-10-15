# FusionLearn

An online learning platform where students browse courses, enrol, complete lessons, take timed quizzes and track their progress on a dashboard. Built with React and TypeScript.

**Live demo:** https://online-learning-platform-ten-wine.vercel.app/

![FusionLearn screenshot](./screenshot.png)

## Features

- Course library with live search (title and description) and category and level filters
- Course pages with topics, a lesson list, enrolment and favourites
- Mark lessons complete or incomplete; progress for each course and overall progress update straight away
- Timed quizzes (60 seconds) for three courses, with a score, pass message and Try Again
- Dashboard: enrolled, favourite and completed counts, a progress chart, four achievements that unlock from real activity, and your favourite courses
- Profile page with validated form (React Hook Form + Zod)
- Light and dark mode, saved between visits
- Everything saved in `localStorage` and checked when read, so corrupt or edited data cannot crash the app
- Keyboard and screen-reader friendly: labelled controls, progress bars with values, toast announcements
- Works on phones, including a navigation row that the old version hid on small screens

## Built with

React 19, TypeScript, Vite, React Router (hash routing), Chart.js via react-chartjs-2, React Hook Form, Zod, Vitest, React Testing Library

## How it is organised

```
src/
  data/        courses.ts, quizzes.ts (sample content)
  lib/         progress.ts (progress, achievements, filtering, scoring), quiz.ts (quiz reducer), storage.ts (validated saved data)
  state/       learningReducer.ts + LearningContext.tsx, ToastContext.tsx
  hooks/       useTheme.tsx
  components/  Layout, CourseCard, ProgressBar, ProgressChart (loaded only when needed)
  pages/       Home, Courses, CourseDetail, Quiz, Dashboard, Profile, NotFound
```

Enrolments, favourites, completed lessons, quiz results and the profile all live in one reducer, so the cards, the dashboard numbers and the chart always agree. Progress, achievements, filtering, quiz scoring and reading saved data are plain functions with their own tests.

## Run it locally

```bash
git clone https://github.com/fusionlearninghub-blip/Online-Learning-Platform.git
cd Online-Learning-Platform
npm install
npm run dev
```

Other commands:

```bash
npm test        # run all tests once
npm run build   # type-check and build for production
```

## Tests

77 tests cover progress and achievement calculations (rounding, duplicates, lessons that do not exist), course search and filters, quiz scoring and the quiz timer, the learning reducer, the on-screen error page, validation of saved data (missing, corrupt or wrongly shaped), and the whole app: enrolling, completing lessons, favourites, taking a quiz, the dashboard, profile editing and validation, dark mode and unknown pages. The chart is replaced with a simple stand-in in tests because the test browser has no canvas, so the chart's drawing itself is checked by eye, not by a test.

## About the sample content

The courses, student counts and ratings are demo data, not real analytics. The home page shows the real number of lessons and courses in the catalogue instead of the old hard-coded "50+ lessons" and "95% success rate" claims. Only courses 1 to 3 have quizzes.

## What I learned / challenges

The first version kept state in several plain variables and redrew each page by hand, so the dashboard had to be rebuilt whenever something changed. In React everything comes from one reducer, which removed that. The trickiest part was the quiz: it has a countdown, a selected answer and a score, so I moved it into a small pure reducer that I could test without waiting 60 real seconds. I also fixed problems I found in the first version: nav links disappeared on phones, unlocked achievements were unreadable in dark mode, and saved data was trusted without checking.

## Author

Kingsley Osayande. [Portfolio](https://kingsley-osayande-portfolio.vercel.app/) / [LinkedIn](https://www.linkedin.com/in/kingsley-osayande-b95446358/)
