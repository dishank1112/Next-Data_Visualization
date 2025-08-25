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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 bg-gray-900/90 rounded-2xl shadow-[0_0_20px_rgba(118,185,0,0.15)] border border-gray-800">
      
      {/* Pagination */}
      <Pagination
        count={totalPages || 1}
        page={page + 1}
        onChange={(_, value) => setPage(value - 1)}
        color="primary"
        shape="rounded"
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#bbb",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "rgba(118,185,0,0.1)", color: "#76b900" },
          },
          "& .Mui-selected": {
            backgroundColor: "#76b900 !important",
            color: "#000 !important",
            fontWeight: "bold",
            boxShadow: "0 0 10px rgba(118,185,0,0.6)",
          },
        }}
      />

      {/* Rows Per Page Selector */}
      <FormControl
        size="small"
        sx={{
          minWidth: 160,
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.75rem",
            backgroundColor: "#111",
            color: "#eee",
          },
          "& fieldset": { borderColor: "#333" },
          "&:hover fieldset": { borderColor: "#76b900" },
          "& .MuiSvgIcon-root": { color: "#aaa" },
        }}
      >
        <InputLabel sx={{ color: "#aaa" }}>Rows per page</InputLabel>
        <Select
          value={rowsPerPage}
          label="Rows per page"
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
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
