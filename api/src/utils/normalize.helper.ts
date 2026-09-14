import { RecentFilings, NormalizedFiling } from "../types/filing.type";

const normalizeFilings = (
  recent: RecentFilings,
  cik: string,
): NormalizedFiling[] => {
  const cikNoLeadingZeros = String(Number(cik));

  // SEC submissions API returns filings.recent as parallel arrays; zip them into one object per filing.
  return recent.accessionNumber.map((accessionNumber, i) => {
    const primaryDocument = recent.primaryDocument[i] ?? "";
    const accessionNoDashes = accessionNumber.replace(/-/g, "");

    return {
      accessionNumber,
      filingDate: recent.filingDate[i] ?? "",
      reportDate: recent.reportDate[i] ?? "",
      form: recent.form[i] ?? "",
      primaryDocument,
      primaryDocDescription: recent.primaryDocDescription[i] ?? "",
      documentUrl: primaryDocument
        ? `https://www.sec.gov/Archives/edgar/data/${cikNoLeadingZeros}/${accessionNoDashes}/${primaryDocument}`
        : "",
    };
  });
};

export default normalizeFilings;
