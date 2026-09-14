export interface NormalizedFiling {
  accessionNumber: string;
  filingDate: string;
  reportDate: string;
  form: string;
  primaryDocument: string;
  primaryDocDescription: string;
  documentUrl: string;
}

export interface PaginatedFilingsResponse {
  ticker: string;
  cik: string;
  name: string;
  sic: string;
  sicDescription: string;
  exchanges: string[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  filings: NormalizedFiling[];
}

export interface CompanySummary {
  ticker: string;
  cik: string;
  name: string;
  filingCountsByForm: Record<string, number>;
  latestTenKDate: string | null;
}

export interface CompanySummaryError {
  ticker: string;
  error: string;
}

export interface FilingsSummaryResponse {
  companies: (CompanySummary | CompanySummaryError)[];
}
