"use client";

import { useEffect, useState } from "react";
import { loadCsv } from "@/utils/loadCsv";
import CsvTable from "@/components/csvTable";
import Chart from "@/components/chart";
import Link from "next/link";

type CsvRow = Record<string, string>;

export default function CsvTablePage() {
  const [data, setData] = useState<CsvRow[]>([]);
  const [filteredData, setFilteredData] = useState<CsvRow[]>([]);

  useEffect(() => {
    loadCsv("/data.csv").then((csvData) => {
      setData(csvData);
      setFilteredData(csvData); // optional — csvTable will call onFilter too
    });
  }, []);

  return (
    <>
      {}
      <Chart rows={filteredData} />

      {}
      <CsvTable data={data} onFilter={setFilteredData} />

      <Link href="/chart">Chart Page</Link>
    </>
  );
}
