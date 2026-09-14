import type {
  CompanySummary,
  CompanySummaryError,
} from "../types/filling.type";

export function isCompanySummaryError(
  entry: CompanySummary | CompanySummaryError,
): entry is CompanySummaryError {
  return "error" in entry;
}
