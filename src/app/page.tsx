"use client";

import { useEffect, useState } from "react";
import { loadCsv } from "@/utils/loadCsv";
import CsvTable from "@/components/csvTable";
import Chart from "@/components/chart";

type CsvRow = Record<string, string>;

export default function CsvTablePage() {
  const [data, setData] = useState<CsvRow[]>([]);
  const [filteredData, setFilteredData] = useState<CsvRow[]>([]);
  useEffect(() => {
    loadCsv("/data.csv").then((csvData) => {
      setData(csvData);
      setFilteredData(csvData);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-gray-200 p-8">
      {}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#76b900] drop-shadow-lg">
          NVIDIA Report
        </h1>
      </header>

      {}
      <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-10 shadow-[0_0_20px_rgba(118,185,0,0.15)] hover:shadow-[0_0_30px_rgba(118,185,0,0.25)] transition">
        {}
        <Chart rows={filteredData} />
      </section>
      {}
      <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-[0_0_20px_rgba(118,185,0,0.15)] hover:shadow-[0_0_30px_rgba(118,185,0,0.25)] transition">
        {}
        <CsvTable data={data} onFilter={setFilteredData} />
      </section>
    </div>
  );
}
