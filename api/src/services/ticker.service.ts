import { Request, Response } from "express";
import type { PaginatedFilingsResponse } from "../types/filing.type";
import normalizeFilings from "../utils/normalize.helper";
import {
  resolveCikFromTicker,
  fetchCompanySubmissions,
} from "../utils/ticker.helper";

const getPaginatedFilings = async (
  ticker: string,
  options: { page: number; pageSize: number; forms?: string[] },
): Promise<PaginatedFilingsResponse | null> => {
  const cik = await resolveCikFromTicker(ticker);
  if (!cik) return null;

  const submissions = await fetchCompanySubmissions(cik);
  const allFilings = normalizeFilings(submissions.filings.recent, cik);
  const filtered = options.forms
    ? allFilings.filter((f) => options.forms!.includes(f.form.toUpperCase()))
    : allFilings;

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / options.pageSize));

  const filings = filtered.slice(
    (options.page - 1) * options.pageSize,
    options.page * options.pageSize,
  );

  return {
    ticker: ticker.toUpperCase(),
    cik,
    name: submissions.name,
    sic: submissions.sic,
    sicDescription: submissions.sicDescription,
    exchanges: submissions.exchanges,
    page: options.page,
    pageSize: options.pageSize,
    totalCount,
    totalPages,
    filings,
  };
};

const getPaginatedFilingsHandler = async (req: Request, res: Response) => {
  const ticker = String(req.params.ticker);
  const page = Math.max(1, Number(req.query.page ?? 1));
  const pageSize = Math.max(1, Number(req.query.pageSize ?? 25));

  const formParam = req.query.form ? String(req.query.form) : undefined;
  const forms = formParam
    ? formParam.split(",").map((f) => f.trim().toUpperCase())
    : undefined;

  const result = await getPaginatedFilings(ticker, {
    page,
    pageSize,
    forms,
  });
  if (!result) {
    res.status(500).json({ error: `Unknown ticker: ${ticker}` });
    return;
  }

  res.json(result);
};

export { getPaginatedFilingsHandler };
