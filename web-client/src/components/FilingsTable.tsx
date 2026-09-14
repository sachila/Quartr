import type { NormalizedFiling } from "../types/filling.type";
import Table from "../common/Table";
import { useMemo } from "react";

const COLUMNS = ["Form", "Filing Date", "Report Date", "Description", ""];

export default function FilingsTable({
  data,
  sortDir,
}: {
  data: NormalizedFiling[];
  sortDir: "desc" | "asc";
}) {
  const filings = useMemo(() => {
    if (!data) return [];
    // SEC already returns filings newest-first; ascending is just the reverse.
    return sortDir === "desc" ? data : [...data].reverse();
  }, [data, sortDir]);

  return (
    <Table
      columns={COLUMNS}
      data={filings}
      rowKey={(filing) => filing.accessionNumber}
      emptyMessage="No filings match the current filters."
      renderRow={(filing) => (
        <>
          <td className="py-2 pr-4 font-medium">{filing.form}</td>
          <td className="py-2 pr-4">{filing.filingDate}</td>
          <td className="py-2 pr-4">{filing.reportDate || "—"}</td>
          <td className="py-2 pr-4 text-gray-600">
            {filing.primaryDocDescription}
          </td>
          <td className="py-2 pr-4">
            {filing.documentUrl && (
              <a
                href={filing.documentUrl}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                View
              </a>
            )}
          </td>
        </>
      )}
    />
  );
}
