"use client";
import { Pagination, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface PaginationControlsProps {
  page: number;
  setPage: (p: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (n: number) => void;
  totalPages: number;
}

export default function PaginationControls({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  totalPages,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">
      {}
      <Pagination
        count={totalPages || 1}
        page={page + 1} 
        onChange={(_, value) => setPage(value - 1)} 
        color="primary"
        shape="rounded"
      />

      {}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Rows per page</InputLabel>
        <Select 
          value={rowsPerPage}
          label="Rows per page"
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }
        }
          >
          {[10, 20, 50, 100].map((n) => (
            <MenuItem key={n} value={n}>
                {n}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
