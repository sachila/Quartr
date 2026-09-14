import { useEffect, useState } from "react";
import { ApiError, getCompanyFilings } from "../services/api.service";
import type { PaginatedFilingsResponse } from "../types/filling.type";
import FilingsTable from "./FilingsTable";
import Pagination from "../common/Pagination";
import FilingFilters from "./FillingFilters";
import { PAGE_SIZE } from "../constants/gloabal.constant";

export default function FilingsExplorer() {
  const [ticker, setTicker] = useState("AAPL");
  const [form, setForm] = useState("");

  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const [data, setData] = useState<PaginatedFilingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false; // added to prevents a race condition from stale/out-of-order requests.

    const loadFilings = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch company filings from the API with the current ticker, page, page size, and form filter.
        const res = await getCompanyFilings(ticker, {
          page,
          pageSize: PAGE_SIZE,
          form: form || undefined,
        });
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(
            err instanceof ApiError ? err.message : "Something went wrong",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadFilings();

    // React calls this before the next effect run / unmount
    return () => {
      cancelled = true;
    };
  }, [ticker, form, page]);

  const loadTicker = (nextTicker: string) => {
    setTicker(nextTicker.toUpperCase());
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <FilingFilters
        ticker={ticker}
        onTickerChange={loadTicker}
        form={form}
        onFormChange={(value) => {
          setForm(value);
          setPage(1);
        }}
        sortDir={sortDir}
        onSortToggle={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
      />

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2 text-sm">
          {error}
        </p>
      )}

      {data && !loading && !error && (
        <>
          <h2 className="text-lg font-semibold">
            {data.name} ({data.ticker}) — CIK {data.cik}
          </h2>
          <FilingsTable data={data.filings} sortDir={sortDir} />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalCount={data.totalCount}
            itemLabel="filings"
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
