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

  if (effectiveRows.length === 0) return <p>Loading chart...</p>;

  const sample = effectiveRows[0];
  const startKey = Object.keys(sample).find((k) => /start/i.test(k)) || "start_date";
  const endKey = Object.keys(sample).find((k) => /end/i.test(k)) || "end_date";
  const capKey = guessCapacityKey(sample) || "quantity_gpus";

  const capacityMap: Record<string, number> = {};
  effectiveRows.forEach((row, idx) => {
    const start = new Date(row[startKey]);
    const end = new Date(row[endKey]);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return;

    const cap = parseInt(String(row[capKey]).replace(/[^0-9\-\.]/g, ""), 10) || 0;
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
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        fill: true,
      },
    ],
  };

const options = {
  responsive: true,
  maintainAspectRatio: false, 
  scales: { y: { beginAtZero: true } },
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "GPUS  W.R.T  Time" },
  },
};

return (
  <div className="p-6">
    <h1 className="text-xl font-bold mb-4">GPU Capacity vs Time</h1>

    {}
    <div className="w-full max-w-xl mx-auto h-110">
      {}
      <Line data={chartData} options={options} />
    </div>
  </div>
);
}
