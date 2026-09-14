import { useState } from "react";
import { ApiError, getFilingsSummary } from "../services/api.service";
import {
  type CompanySummary,
  type CompanySummaryError,
} from "../types/filling.type";
import Button from "../common/Button";
import Input from "../common/Input";
import { DEMO_TICKERS } from "../constants/gloabal.constant";
import { isCompanySummaryError } from "../utils/summaryHelper";

export default function SummaryView() {
  const [tickersInput, setTickersInput] = useState(DEMO_TICKERS.join(", "));

  const [companies, setCompanies] = useState<
    (CompanySummary | CompanySummaryError)[] | null
  >(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tickers = tickersInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (tickers.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getFilingsSummary(tickers);
      setCompanies(res.companies);
    } catch (err) {
      setCompanies(null);
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form className="flex items-end gap-2" onSubmit={handleSubmit}>
        <div className="flex-1 max-w-lg">
          <Input
            label="Tickers (comma-separated)"
            className="w-full"
            value={tickersInput}
            onChange={(e) => setTickersInput(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary">
          Get Summary
        </Button>
      </form>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2 text-sm">
          {error}
        </p>
      )}

      {companies && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) =>
            isCompanySummaryError(company) ? (
              <div
                key={company.ticker}
                className="border border-red-200 bg-red-50 rounded-lg p-4"
              >
                <h3 className="font-semibold text-red-700">{company.ticker}</h3>
                <p className="text-sm text-red-600 mt-1">{company.error}</p>
              </div>
            ) : (
              <div
                key={company.ticker}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold">
                  {company.ticker} — {company.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Latest 10-K: {company.latestTenKDate ?? "N/A"}
                </p>
                <p className="text-xs font-medium text-gray-500 mt-3 mb-1">
                  Filings by form (last 12 months)
                </p>
                <ul className="text-sm space-y-1">
                  {Object.entries(company.filingCountsByForm).map(
                    ([form, count]) => (
                      <li key={form} className="flex justify-between">
                        <span>{form}</span>
                        <span className="font-medium">{count}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
