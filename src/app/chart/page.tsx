"use client"

import { useEffect, useState } from "react";

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

import { loadCsv } from "@/utils/loadCsv";

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
  const keys = Object.keys(sampleRow).map((k) => k.toLowerCase());
  const candidates = ["quantity_gpus", "quantity", "capacity", "gpu_capacity", "quantity_gpus", "quantity_gpus"];
  for (const c of candidates) {
    const found = Object.keys(sampleRow).find((k) => k.toLowerCase() === c);
    if (found) return found;
  }
  // fallback: look for any key containing "quantity" or "gpu" or "cap"
  const fallback = Object.keys(sampleRow).find((k) =>
    /quantity|gpu|cap/i.test(k)
  );
  return fallback || null;
}

export default function ChartPage() {
  const [rows, setRows] = useState<CsvRow[]>([]);

  useEffect(() => {
    loadCsv("/data.csv").then((d) => {
      console.log("CSV loaded rows (first 5):", d.slice(0, 5));
      setRows(d);
    });
  }, []);

  if (rows.length === 0) return <p>Loading chart...</p>;

  // detect keys
  const sample = rows[0];
  const startKey = Object.keys(sample).find((k) => /start/i.test(k)) || "start_date";
  const endKey = Object.keys(sample).find((k) => /end/i.test(k)) || "end_date";
  const capKey = guessCapacityKey(sample) || "quantity_gpus";

  console.log("Using keys:", { startKey, endKey, capKey });

  // capacity by month
  const capacityMap: Record<string, number> = {};

  rows.forEach((row, idx) => {
    const startRaw = row[startKey];
    const endRaw = row[endKey];
    const capRaw = row[capKey];

    if (!startRaw || !endRaw) {
      return;
    }

    const start = new Date(startRaw.toString().trim());
    const end = new Date(endRaw.toString().trim());
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn(`Skipping row ${idx} due to invalid date`, { startRaw, endRaw });
      return;
    }
    if (end < start) {
      console.warn(`Skipping row ${idx} because end < start`, { startRaw, endRaw });
      return;
    }

    let cap = 0;
    if (capRaw !== undefined && capRaw !== null) {
      const digits = String(capRaw).replace(/[^0-9\-\.]/g, "");
      cap = parseInt(digits, 10);
      if (isNaN(cap)) cap = 0;
    }


    monthsBetween(start, end).forEach((m) => {
      capacityMap[m] = (capacityMap[m] || 0) + cap;
    });
  });

  const labels = Object.keys(capacityMap)
    .sort((a, b) => new Date(a + "-01").getTime() - new Date(b + "-01").getTime());
  const values = labels.map((m) => capacityMap[m] || 0);

  console.log("Aggregated months:", labels.length, "example:", labels.slice(0, 6));
  console.log("Aggregated values (first 10):", values.slice(0, 10));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total GPUs Available",
        data: values,
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "GPU Capacity vs Time" },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">GPU Capacity vs Time</h1>
      <Line data={chartData} options={options} />
    </div>
  );
}
