"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";

import DataTable from "./DataTable";
import PaginationControls from "./PaginationControls";

type CsvRow = Record<string, string>;

interface CsvTableProps {
  data: CsvRow[]; 
  unitMode?: "gpu" | "node";
}

export default function CsvTable({ data, unitMode = "gpu" }: CsvTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const displayKey = unitMode === "gpu" ? "quantity_gpus" : "quantity_nodes";

  const headerMapping: Record<string, string> = {
    start_date: "Start Date",
    end_date: "End Date",
    block_name: "Block Name",
    dc_name: "DC Name",
    block_location: "Block Location",
    gpu_type: "GPU Type",
    service_provider: "Service Provider",
    [displayKey]: unitMode === "gpu" ? "Quantity of GPUs" : "Quantity of Nodes",
  };

  const parseGpuCount = (row: CsvRow) => {
    const raw = String(row["quantity_gpus"] ?? row["Quantity of GPUs"] ?? "0");
    const num = Number(raw.replace(/[^0-9.+-eE]/g, "")) || 0;
    return num;
  };

  const paginatedData = useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, page, rowsPerPage]
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const displayData = useMemo(
    () =>
      paginatedData.map((row) => {
        const r: CsvRow = { ...row };
        const num = parseGpuCount(row);

        if (displayKey === "quantity_nodes") {
          r["quantity_nodes"] = String(Math.ceil(num / 8));
          delete r["quantity_gpus"];
        } else {
          r["quantity_gpus"] = String(num);
          delete r["quantity_nodes"];
        }

        return r;
      }),
    [paginatedData, displayKey]
  );

  // ✅ Process all rows (for Excel export)
  const processedAllData = useMemo(
    () =>
      data.map((row) => {
        const r: CsvRow = { ...row };
        const num = parseGpuCount(row);

        r["quantity_gpus"] = String(num);
        r["quantity_nodes"] = String(Math.ceil(num / 8));

        if (displayKey === "quantity_nodes") {
          delete r["quantity_gpus"];
        } else {
          delete r["quantity_nodes"];
        }
        return r;
      }),
    [data, displayKey]
  );

  function ExportDataToExcel(exportData: CsvRow[]) {
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FilteredData");
    XLSX.writeFile(wb, "exported_data.xlsx");
  }

  return (
    <div className="p-6 bg-gray-900/90 rounded-2xl shadow-[0_0_25px_rgba(118,185,0,0.15)] border border-gray-800 text-gray-200 transition hover:shadow-[0_0_40px_rgba(118,185,0,0.25)]">
      <h2 className="text-xl font-bold text-[#76b900] mb-6 tracking-wide">
        Data Table
      </h2>

      {/* Table */}
      <div className="overflow-x-auto my-6 rounded-xl border border-gray-700 shadow-inner">
        <DataTable
          data={displayData}
          allData={processedAllData}
          headerMapping={headerMapping}
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6">
        <PaginationControls
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(r) => {
            setRowsPerPage(r);
            setPage(0);
          }}
          totalPages={totalPages}
          totalItems={data.length}
        />
      </div>

      {/* Export Button */}
      <div className="mt-4 text-right">
        <button
          onClick={() => ExportDataToExcel(data)}
          className="px-4 py-2 bg-[#76b900] text-black font-semibold rounded-lg hover:bg-[#5a9600] transition"
        >
          Export Data to Excel
        </button>
      </div>
    </div>
  );
}
