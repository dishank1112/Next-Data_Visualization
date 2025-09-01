"use client";
import { FormControl, Select, MenuItem, Chip, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type CsvRow = Record<string, string>;

interface FiltersPanelProps {
  data: CsvRow[];
  filters: Record<string, string[]>;
  setFilters: (f: Record<string, string[]>) => void;
  unitMode: "gpu" | "node";
  setUnitMode: (m: "gpu" | "node") => void;
}

const headerMapping: Record<string, string> = {
  block_name: "Block Name",
  dc_name: "DC Name",
  block_location: "Block Location",
  gpu_type: "GPU Type",
  service_provider: "Service Provider",
};

export default function FiltersPanel({ data, filters, setFilters, unitMode, setUnitMode }: FiltersPanelProps) {
  const columns = ["block_name", "dc_name", "block_location", "gpu_type", "service_provider"];

  const getUniqueValues = (col: string) =>
    [...new Set(data.map((row) => row[col]))].filter(Boolean);

  const toggleFilter = (col: string, value: string) => {
    setFilters((prev: Record<string, string[]>) => {
      const current = prev[col] || [];
      return current.includes(value)
        ? { ...prev, [col]: current.filter((v) => v !== value) }
        : { ...prev, [col]: [...current, value] };
    });
  };

  const clearFilter = (col: string) => {
    setFilters((prev) => ({ ...prev, [col]: [] }));
  };

  return (
    // added `relative` so the toggle can be absolutely positioned at the right edge
    <div className="relative flex flex-wrap gap-6 p-4 bg-[#0b111b] rounded-xl shadow-lg border border-gray-800">
      {/* Absolute positioned GPU/Node toggle at the extreme right */}
      <div className="absolute right-4 top-4 flex items-center gap-3 select-none z-10">
        <span className={`text-sm ${unitMode === "gpu" ? "text-white" : "text-gray-400"}`}>GPU</span>

        {/* pill toggle */}
        <button
          type="button"
          aria-pressed={unitMode === "node"}
          onClick={() => setUnitMode(unitMode === "gpu" ? "node" : "gpu")}
          className="relative w-12 h-6 rounded-full bg-[#2b2f33] flex items-center px-1 cursor-pointer transition-colors"
        >
          {/* knob */}
          <span
            className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
              unitMode === "node" ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>

        <span className={`text-sm ${unitMode === "node" ? "text-white" : "text-gray-400"}`}>Node</span>
      </div>

      {/* (columns) Filters — unchanged */}
      {columns.map((col) => (
        <div key={col} className="flex flex-col gap-2 min-w-[220px] max-w-[280px]">
          {/* Proper Label (custom, above the select) */}
          <label className="font-semibold text-green-400">
            {headerMapping[col] || col}
          </label>

          {/* Chips */}
          {filters[col]?.length > 0 && (
            <Box className="flex flex-wrap gap-2 mb-2">
              {filters[col].map((val) => (
                <Chip
                  key={val}
                  label={val}
                  onDelete={() => toggleFilter(col, val)}
                  sx={{
                    backgroundColor: "#10231a",
                    color: "#1ed760",
                    border: "1px solid #1ed76080",
                    fontWeight: 500,
                    "& .MuiChip-deleteIcon": {
                      color: "#1ed760",
                      "&:hover": { color: "#29ff85" },
                    },
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          <FormControl
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#141a24",
                color: "#fff",
                borderRadius: "12px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#333",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1ed760",
              },
              "& .MuiSvgIcon-root": { color: "#aaa" },
            }}
          >
            <Select
              multiple
              displayEmpty
              value={filters[col] || []}
              onChange={(e) => {
                const selected = e.target.value as string[];
                setFilters((prev) => ({ ...prev, [col]: selected }));
              }}
              renderValue={(selected: any) =>
                selected.length === 0 ? (
                  <span className="italic text-gray-400">Select {headerMapping[col] || col}</span>
                ) : (
                  <span className="truncate">{selected.join(", ")}</span>
                )
              }
              endAdornment={
                filters[col]?.length > 0 && (
                  <IconButton
                    size="small"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearFilter(col);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ color: "#aaa", "&:hover": { color: "#fff" }, mr: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )
              }
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#0b111b",
                    color: "#fff",
                    border: "1px solid #1ed76030",
                    maxHeight: 48 * 5,
                    "&::-webkit-scrollbar": { width: "8px" },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#1ed76080",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": { backgroundColor: "#111" },
                  },
                },
              }}
            >
              {getUniqueValues(col).map((val) => (
                <MenuItem
                  key={val}
                  value={val}
                  onClick={() => toggleFilter(col, val)}
                  sx={{
                    backgroundColor: "#0b111b",
                    "&.Mui-selected": {
                      backgroundColor: "#1ed76030 !important",
                      color: "#1ed760",
                      fontWeight: 600,
                    },
                    "&:hover": { backgroundColor: "#1ed76020" },
                  }}
                >
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ))}
    </div>
  );
}
