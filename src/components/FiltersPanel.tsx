"use client";
import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from "@mui/material";

type CsvRow = Record<string, string>;

interface FiltersPanelProps {
  data: CsvRow[];
  filters: Record<string, string[]>;
  setFilters: (f: Record<string, string[]>) => void;
}

export default function FiltersPanel({
  data,
  filters,
  setFilters,
}: FiltersPanelProps) {
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
    <div className="flex flex-wrap gap-6">
      {columns.map((col) => (
        <div key={col} className="flex flex-col gap-2 min-w-[200px]">
          <label className="font-semibold capitalize">{col.replace("_", " ")}</label>

          {/* Selected Chips */}
          {filters[col]?.length > 0 && (
            <Box className="flex flex-wrap gap-2 mb-2">
              {filters[col].map((val) => (
                <Chip
                  key={val}
                  label={val}
                  onDelete={() => toggleFilter(col, val)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          {}
          <FormControl fullWidth size="small">
            <InputLabel>{col}</InputLabel>
            <Select
              multiple
              value={filters[col] || []}
              onChange={(e) => {
                const selected = e.target.value as string[];
                setFilters((prev) => ({ ...prev, [col]: selected }));
              }}
              renderValue={(selected) => selected.join(", ")}
            >
              {getUniqueValues(col).map((val) => (
                <MenuItem
                  key={val}
                  value={val}
                  onClick={() => toggleFilter(col, val)}
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
