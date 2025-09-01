"use client";

import { useEffect, useState, useMemo } from "react";
import { loadCsv } from "@/utils/loadCsv";
import CsvTable from "@/components/csvTable";
import Chart from "@/components/chart";
import SearchBox from "@/components/SearchBox";
import FiltersPanel from "@/components/FiltersPanel";

type CsvRow = Record<string, string>;

export default function CsvTablePage() {
  const [data, setData] = useState<CsvRow[]>([]);
  const [filteredData, setFilteredData] = useState<CsvRow[]>([]); 
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [unitMode, setUnitMode] = useState<"gpu" | "node">("gpu"); 

  useEffect(() => {
    loadCsv("/data.csv").then((csvData) => {
      setData(csvData);
      setFilteredData(csvData);
    });
  }, []);

  useEffect(() => {
    const newFiltered = data.filter((row) => {
      const passesFilters = Object.entries(filters).every(
        ([col, values]) => values.length === 0 || values.includes(row[col])
      );

      const passesSearch =
        !search ||
        Object.values(row).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        );

      return passesFilters && passesSearch;
    });

    setFilteredData(newFiltered);
  }, [data, filters, search]);

  const tableData = useMemo(() => {
    if (unitMode === "gpu") return filteredData;

    return filteredData.map((row) => {
  
      const raw = row["quantity_gpus"] ?? row["Quantity of GPUs"] ?? row["quantity"] ?? "0";
      const num = Number(String(raw).replace(/[^0-9.-]/g, "")) || 0;

      const nodes = Math.ceil(num / 8);
      return {
        ...row,
        quantity_nodes: String(nodes),
      };
    });
  }, [filteredData, unitMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-gray-200 p-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#76b900] drop-shadow-lg">
          NVIDIA Report
        </h1>
      </header>

      {}
      <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-10 shadow-[0_0_20px_rgba(118,185,0,0.15)] hover:shadow-[0_0_30px_rgba(118,185,0,0.25)] transition">
        {}
        <SearchBox value={search} onChange={(val) => setSearch(val)} />

        {}
        <div className="mb-4">
          <FiltersPanel
            data={data}
            filters={filters}
            setFilters={setFilters}
            unitMode={unitMode}        
            setUnitMode={setUnitMode}    
          />
        </div>

        {}
        <Chart rows={filteredData} />
      </section>

      {}
      <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-[0_0_20px_rgba(118,185,0,0.15)] hover:shadow-[0_0_30px_rgba(118,185,0,0.25)] transition">
        {/* Pass tableData that already has quantity_nodes when unitMode === "node" */}
        <CsvTable
          data={tableData}
          unitMode={unitMode} 
        />
      </section>
    </div>
  );
}
