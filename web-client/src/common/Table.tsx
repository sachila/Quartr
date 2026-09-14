import type { ReactNode } from "react";

interface TableProps<T> {
  columns: string[];
  data: T[];
  rowKey: (item: T) => string;
  renderRow: (item: T) => ReactNode;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  rowKey,
  renderRow,
  emptyMessage = "No data available.",
}: TableProps<T>) {
  if (data.length === 0) {
    return <p className="text-gray-500 py-8 text-center">{emptyMessage}</p>;
  }

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-gray-300 text-left text-gray-600">
          {columns.map((column) => (
            <th key={column} className="py-2 pr-4">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={rowKey(item)}
            className="border-b border-gray-100 hover:bg-gray-50"
          >
            {renderRow(item)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
