"use client";

import { useState } from "react";
import SearchBox from "./SearchBox";
import FiltersPanel from "./FiltersPanel";
import DataTable from "./DataTable";
import PaginationControls from "./PaginationControls";

type CsvRow = Record<string, string>;

interface CsvTableProps {
  data: CsvRow[];
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

export default function CsvTable({ data }: CsvTableProps) {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

const filteredData = data.filter((row) => {
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

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
      <div className="p-6 space-y-6">
      <SearchBox value={search} onChange={(val) => { setSearch(val); setPage(0); }}/>
      <FiltersPanel
        data={data}
        filters={filters}
        setFilters={(f) => { setFilters(f); setPage(0); }}
      />

      <DataTable data={paginatedData} allData={data} />
      <PaginationControls
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPages={totalPages}
      />
    </div>
  );
}
