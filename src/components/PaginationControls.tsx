"use client";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface PaginationControlsProps {
  page: number;
  setPage: (p: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (n: number) => void;
  totalPages: number;
  totalItems?: number; 
}

export default function PaginationControls({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  totalPages,
  totalItems = 0,
}: PaginationControlsProps) {
  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, totalItems);
  
  // Using Material UI, simply used Pagination function, with 4 buttons

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-6 bg-gray-900/90 rounded-3xl shadow-[0_0_28px_rgba(118,185,0,0.2)] border border-gray-800 text-gray-200 text-base md:text-lg">
      
      {/* Left side info */}
      <span>
        {totalItems > 0
          ? `${startItem} to ${endItem} of ${totalItems}`
          : `Page ${page + 1} of ${totalPages}`}
      </span>

      {/* Navigation */}
      <div className="flex items-center gap-4 text-lg">
        <Button
          onClick={() => setPage(0)}
          disabled={page === 0}
          sx={{ color: "#bbb", minWidth: "48px", fontSize: "1.25rem" }}
        >
          ⏮
        </Button>
        <Button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          sx={{ color: "#bbb", minWidth: "48px", fontSize: "1.25rem" }}
        >
          ⏪
        </Button>

        <span className="text-lg">
          Page <b>{page + 1}</b> of <b>{totalPages}</b>
        </span>

        <Button
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          sx={{ color: "#bbb", minWidth: "48px", fontSize: "1.25rem" }}
        >
          ⏩
        </Button>
        <Button
          onClick={() => setPage(totalPages - 1)}
          disabled={page >= totalPages - 1}
          sx={{ color: "#bbb", minWidth: "48px", fontSize: "1.25rem" }}
        >
          ⏭
        </Button>
      </div>

      {/* Rows Per Page Selector */}
      <FormControl
        size="medium" 
        sx={{
          minWidth: 200,
          "& .MuiOutlinedInput-root": {
            borderRadius: "1rem",
            backgroundColor: "#111",
            color: "#eee",
            fontSize: "1.1rem", 
            height: "48px", 
          },
          "& fieldset": { borderColor: "#333" },
          "&:hover fieldset": { borderColor: "#76b900" },
          "& .MuiSvgIcon-root": { color: "#aaa", fontSize: "1.25rem" },
        }}
      >
        <InputLabel sx={{ color: "#aaa", fontSize: "1rem" }}>Rows per page</InputLabel>
        <Select
          value={rowsPerPage}
          label="Rows per page"
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
        >
          {[10, 20, 50, 100].map((n) => (
            <MenuItem key={n} value={n} sx={{ fontSize: "1.1rem" }}>
              {n}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
