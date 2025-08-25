"use client";
import { FormControl, InputLabel, Select, MenuItem, Chip, Box } from "@mui/material";

type CsvRow = Record<string, string>;

interface FiltersPanelProps {
  data: CsvRow[];
  filters: Record<string, string[]>;
  setFilters: (f: Record<string, string[]>) => void;
}

export default function FiltersPanel({ data, filters, setFilters }: FiltersPanelProps) {
  // ✅ Explicit columns only, prevents duplicates
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

  return (
    <div className="flex flex-wrap gap-6 p-4 bg-[#0b111b] rounded-xl shadow-lg border border-gray-800">
      {columns.map((col) => (
        <div key={col} className="flex flex-col gap-2 min-w-[220px] max-w-[280px]">
          <label className="font-semibold text-green-400 capitalize">
            {col.replace("_", " ")}
          </label>

          {/* ✅ Chips: wrap across multiple lines */}
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
  <InputLabel sx={{ color: "#aaa" }}>{col}</InputLabel>
  <Select
  multiple
  value={filters[col] || []}
  onChange={(e) => {
    const selected = e.target.value as string[];
    setFilters((prev) => ({ ...prev, [col]: selected }));
  }}
  renderValue={(selected) =>
    selected.length === 0 ? (
      <span className="italic text-gray-400">All</span>
    ) : (
      <span className="truncate">{selected.join(", ")}</span>
    )
  }
  MenuProps={{
    PaperProps: {
      sx: {
        backgroundColor: "#0b111b",
        color: "#fff",
        border: "1px solid #1ed76030",
        maxHeight: 48 * 5, // scroll after 5 items
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
