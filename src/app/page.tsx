"use client";

import { useEffect, useState } from "react";
import { loadCsv } from "@/utils/loadCsv";
import CsvTable from "@/components/csvTable";
import Link from "next/link";  

type CsvRow = Record<string, string>;

export default function CsvTablePage() {
  const [data, setData] = useState<CsvRow[]>([]);
  useEffect(() => {
    loadCsv("/data.csv").then(setData);
  }, []);
  return (
    <>
      <CsvTable data={data} />
      <Link href="/chart" >Chart Page</Link>
    </>
  );
}
