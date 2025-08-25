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

type CsvRow = Record<string, string>;

interface DataTableProps {
  data: CsvRow[];
  allData: CsvRow[];
}

export default function DataTable({ data, allData }: DataTableProps) {
  const columns = Object.keys(allData[0] || {});

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-2xl shadow-[0_0_25px_rgba(118,185,0,0.15)] bg-gray-900/90">
      <div className="max-h-[600px] overflow-y-auto">
        <table className="table-auto w-full text-sm border-collapse">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-3 text-[#76b900] uppercase tracking-wider text-xs border-b border-gray-700"
                >
                  {headerMapping[col] || col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-800/60 transition-colors duration-200"
                >
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      className="border-b border-gray-800 px-4 py-2 text-gray-200"
                    >
                      {String(val ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={allData[0] ? Object.keys(allData[0]).length : 1}
                  className="text-center text-gray-500 py-8"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
