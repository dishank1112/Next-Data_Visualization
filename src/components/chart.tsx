"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type CsvRow = Record<string, string>;

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthsBetween(start: Date, end: Date): string[] {
  const months: string[] = [];
  const d = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

  while (d <= endMonth) {
    months.push(monthKey(d));
    d.setMonth(d.getMonth() + 1);
  }
  return months;
}

function guessCapacityKey(sampleRow: CsvRow | undefined): string | null {
  if (!sampleRow) return null;
  const candidates = ["quantity_gpus", "quantity", "capacity", "gpu_capacity"];
  for (const c of candidates) {
    const found = Object.keys(sampleRow).find((k) => k.toLowerCase() === c);
    if (found) return found;
  }
  return Object.keys(sampleRow).find((k) => /quantity|gpu|cap/i.test(k)) || null;
}

export default function Chart({ rows }: { rows?: CsvRow[] }) {
  const effectiveRows = rows || [];

  if (effectiveRows.length === 0)
    return <p className="text-gray-400 italic">Loading chart...</p>;

  const sample = effectiveRows[0];
  const startKey = Object.keys(sample).find((k) => /start/i.test(k)) || "start_date";
  const endKey = Object.keys(sample).find((k) => /end/i.test(k)) || "end_date";
  const capKey = guessCapacityKey(sample) || "quantity_gpus";

  const capacityMap: Record<string, number> = {};
  effectiveRows.forEach((row) => {
    const start = new Date(row[startKey]);
    const end = new Date(row[endKey]);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return;

    const cap = parseInt(String(row[capKey]).replace(/[^0-9\\-\\.]/g, ""), 10) || 0;
    monthsBetween(start, end).forEach((m) => {
      capacityMap[m] = (capacityMap[m] || 0) + cap;
    });
  });

  const labels = Object.keys(capacityMap).sort(
    (a, b) => new Date(a + "-01").getTime() - new Date(b + "-01").getTime()
  );
  const values = labels.map((m) => capacityMap[m] || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "GPUs",
        data: values,
        borderColor: "#76B900", 
        backgroundColor: "rgba(118,185,0,0.15)",
        pointBackgroundColor: "#76B900",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
      y: { beginAtZero: true, ticks: { color: "#aaa" }, grid: { color: "#333" } },
    },
    plugins: {
      legend: { labels: { color: "#76B900" }, position: "top" as const },
      title: {
        display: true,
        text: "GPU Capacity Over Time",
        color: "#76B900",
        font: { size: 18, weight: "bold" },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-900/90 rounded-2xl shadow-[0_0_25px_rgba(118,185,0,0.15)] border border-gray-800 hover:shadow-[0_0_40px_rgba(118,185,0,0.25)] transition">
      <h2 className="text-xl font-semibold text-[#76b900] mb-6 tracking-wide">
        GPUs w.r.t Time
      </h2>
      <div className="w-full max-w-5xl mx-auto h-96">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
