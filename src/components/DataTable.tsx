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
    <div className="overflow-x-auto border rounded-xl shadow">
      <div className="max-h-[600px] overflow-y-auto">
        <table className="table-auto border-collapse border w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
            <th key={col}>
                 {headerMapping[col] || col}
            </th>
          ))}
          </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="border px-3 py-2">
                      {String(val ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={allData[0] ? Object.keys(allData[0]).length : 1}
                  className="text-center text-gray-500 py-4"
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
