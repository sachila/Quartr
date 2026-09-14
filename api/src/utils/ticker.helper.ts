import {
  CompanyTickersResponse,
  SecSubmissionsResponse,
} from "../types/filing.type";
import { getApi } from "./api";

const TICKER_MAP_TTL_MS = 24 * 60 * 60 * 1000; // cache 24 hours to reduce the heavy payload
const TICKER_MAP_URL = "https://www.sec.gov/files/company_tickers.json";
const SUBMISSIONS_URL = "https://data.sec.gov/submissions";

let tickerMapCache: Map<string, string> | null = null;
let tickerMapCachedAt = 0;

const fetchTickerMap = async (): Promise<Map<string, string>> => {
  const isStale = Date.now() - tickerMapCachedAt > TICKER_MAP_TTL_MS;
  // If the cache is still valid, return it to avoid fetching the large ticker map again.
  if (tickerMapCache && !isStale) {
    return tickerMapCache;
  }

  const res = await getApi(TICKER_MAP_URL);
  const data = (await res.json()) as CompanyTickersResponse;

  const map = new Map<string, string>();
  // Populate the map with ticker to CIK mappings.
  for (const entry of Object.values(data)) {
    map.set(
      entry.ticker.toUpperCase(),
      String(entry.cik_str).padStart(10, "0"), // Ensure CIK is 10 digits with leading zeros
    );
  }
  // Update the cache with the newly fetched map.
  tickerMapCache = map;
  tickerMapCachedAt = Date.now();
  return map;
};

const resolveCikFromTicker = async (
  ticker: string,
): Promise<string | undefined> => {
  const map = await fetchTickerMap();
  return map.get(ticker.toUpperCase());
};

const fetchCompanySubmissions = async (
  cik: string,
): Promise<SecSubmissionsResponse> => {
  const res = await getApi(`${SUBMISSIONS_URL}/CIK${cik}.json`);
  return (await res.json()) as SecSubmissionsResponse;
};

export { resolveCikFromTicker, fetchCompanySubmissions };
