"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBox from "./SearchBox";
import FiltersPanel from "./FiltersPanel";
import DataTable from "./DataTable";
import PaginationControls from "./PaginationControls";

type CsvRow = Record<string, string>;

interface CsvTableProps {
  data: CsvRow[];
  onFilter?: (rows: CsvRow[]) => void;
}

const headerMapping: Record<string, string> = {
  start_date: "Start Date",
  end_date: "End Date",
  block_name: "Block Name",
  dc_name: "DC Name",
  block_location: "Block Location",
  gpu_type: "GPU Type",
  service_provider: "Service Provider",
  quantity_gpus: "Quantity of GPUs",
};

export default function CsvTable({ data, onFilter }: CsvTableProps) {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
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
  }, [data, filters, search]);

  useEffect(() => {
    setPage(0);
    if (onFilter) onFilter(filteredData);
  }, [filteredData, onFilter]);

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="p-6 bg-gray-900/90 rounded-2xl shadow-[0_0_25px_rgba(118,185,0,0.15)] border border-gray-800 text-gray-200 transition hover:shadow-[0_0_40px_rgba(118,185,0,0.25)]">
      {}
      <h2 className="text-xl font-bold text-[#76b900] mb-6 tracking-wide">
        Data Table
      </h2>

      {}
        <SearchBox
          value={search}
          onChange={(val) => setSearch(val)}
        />
    

      {/* Filters */}
      <div className="mb-4">
        <FiltersPanel
          data={data}
          filters={filters}
          setFilters={(f) => setFilters(f)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto my-6 rounded-xl border border-gray-700 shadow-inner">
        <DataTable
          data={paginatedData}
          allData={data}
          // headerMapping={headerMapping}
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
        />
      </div>
    </div>
  );
}
