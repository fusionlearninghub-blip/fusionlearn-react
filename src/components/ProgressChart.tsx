import {
  BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "../hooks/useTheme";

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface ChartPoint {
  title: string;
  progress: number;
}

export default function ProgressChart({ points }: { points: ChartPoint[] }) {
  const { theme } = useTheme();
  const text = theme === "dark" ? "#cbd5e1" : "#475569";
  const grid = theme === "dark" ? "rgba(148,163,184,0.2)" : "rgba(100,116,139,0.15)";

  return (
    <Bar
      aria-label="Bar chart of progress for each enrolled course"
      role="img"
      data={{
        labels: points.map((p) => p.title),
        datasets: [
          {
            label: "Course Progress (%)",
            data: points.map((p) => p.progress),
            backgroundColor: "#6366f1",
            borderRadius: 8,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: text } } },
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { color: text }, grid: { color: grid } },
          x: { ticks: { color: text }, grid: { color: grid } },
        },
      }}
    />
  );
}
