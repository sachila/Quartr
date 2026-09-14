import { Request, Response } from "express";
import {
  CompanySummary,
  CompanySummaryError,
  NormalizedFiling,
} from "../types/filing.type";
import normalizeFilings from "../utils/normalize.helper";
import {
  fetchCompanySubmissions,
  resolveCikFromTicker,
} from "../utils/ticker.helper";
const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

const summarizeFilings = (
  filings: NormalizedFiling[],
  ticker: string,
  cik: string,
  name: string,
): CompanySummary => {
  const twelveMonthsAgo = new Date(Date.now() - TWELVE_MONTHS_MS);

  const filingCountsByForm: Record<string, number> = {};
  for (const filing of filings) {
    if (new Date(filing.filingDate) < twelveMonthsAgo) continue;
    filingCountsByForm[filing.form] =
      (filingCountsByForm[filing.form] ?? 0) + 1;
  }

  // Latest 10-K is searched across full history, not just the last 12 months.
  const tenKDates = filings
    .filter((filing) => filing.form === "10-K")
    .map((filing) => filing.filingDate)
    .sort();
  const latestTenKDate = tenKDates.length
    ? tenKDates[tenKDates.length - 1]
    : null;

  return { ticker, cik, name, filingCountsByForm, latestTenKDate };
};

const getFilingsSummaries = (
  tickers: string[],
): Promise<(CompanySummary | CompanySummaryError)[]> => {
  return Promise.all(
    tickers.map(async (ticker) => {
      try {
        const cik = await resolveCikFromTicker(ticker);
        if (!cik) {
          return { ticker: ticker.toUpperCase(), error: "Unknown ticker" };
        }

        const submissions = await fetchCompanySubmissions(cik);
        const filings = normalizeFilings(submissions.filings.recent, cik);
        return summarizeFilings(
          filings,
          ticker.toUpperCase(),
          cik,
          submissions.name,
        );
      } catch {
        return {
          ticker: ticker.toUpperCase(),
          error: "Failed to fetch data from SEC EDGAR",
        };
      }
    }),
  );
};

const getFilingsSummariesHandler = async (req: Request, res: Response) => {
  const tickersParam = req.query.tickers ? String(req.query.tickers) : "";
  const tickers = tickersParam
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tickers.length === 0) {
    res.status(400).json({ error: "Query param 'tickers' is required" });
    return;
  }

  const companies = await getFilingsSummaries(tickers);
  res.json({ companies });
};

export { getFilingsSummariesHandler };
