export interface CompanyTickersEntry {
  cik_str: number;
  ticker: string;
  title: string;
}

export type CompanyTickersResponse = Record<string, CompanyTickersEntry>;

export interface RecentFilings {
  accessionNumber: string[];
  filingDate: string[];
  reportDate: string[];
  form: string[];
  primaryDocument: string[];
  primaryDocDescription: string[];
  items: string[];
  size: number[];
  isXBRL: number[];
}

export interface SecSubmissionsResponse {
  cik: string;
  entityType: string;
  sic: string;
  sicDescription: string;
  name: string;
  tickers: string[];
  exchanges: string[];
  filings: {
    recent: RecentFilings;
    files: { name: string; filingFrom: string; filingTo: string }[];
  };
}

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

