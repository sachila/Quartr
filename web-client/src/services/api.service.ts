import type {
  FilingsSummaryResponse,
  PaginatedFilingsResponse,
} from "../types/filling.type";
import { handleResponse } from "./handleResponse.service";

export class ApiError extends Error {}

export async function getCompanyFilings(
  ticker: string,
  opts: { page?: number; pageSize?: number; form?: string } = {},
): Promise<PaginatedFilingsResponse> {
  const params = new URLSearchParams();
  if (opts.page) params.set("page", String(opts.page));
  if (opts.pageSize) params.set("pageSize", String(opts.pageSize));
  if (opts.form) params.set("form", opts.form);

  const res = await fetch(
    `/api/companies/${ticker}/filings?${params.toString()}`,
  );
  return handleResponse<PaginatedFilingsResponse>(res);
}

export async function getFilingsSummary(
  tickers: string[],
): Promise<FilingsSummaryResponse> {
  const params = new URLSearchParams({ tickers: tickers.join(",") });

  const res = await fetch(`/api/filings/summary?${params.toString()}`);
  return handleResponse<FilingsSummaryResponse>(res);
}
