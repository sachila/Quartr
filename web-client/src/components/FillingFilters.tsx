import Select from "../common/Select";
import Button from "../common/Button";
import { DEMO_TICKERS, FORM_TYPES } from "../constants/gloabal.constant";

const TICKER_OPTIONS = DEMO_TICKERS.map((t) => ({ value: t, label: t }));

const FORM_FILTER_OPTIONS = [
  { value: "", label: "All forms" },
  ...FORM_TYPES.map((type: string) => ({ value: type, label: type })),
];

interface FilingFiltersProps {
  ticker: string;
  onTickerChange: (ticker: string) => void;
  form: string;
  onFormChange: (form: string) => void;
  sortDir: "desc" | "asc";
  onSortToggle: () => void;
}

export default function FilingFilters({
  ticker,
  onTickerChange,
  form,
  onFormChange,
  sortDir,
  onSortToggle,
}: FilingFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Select
        label="Company"
        value={ticker}
        onChange={onTickerChange}
        options={TICKER_OPTIONS}
      />

      <Select
        label="Form type"
        value={form}
        onChange={onFormChange}
        options={FORM_FILTER_OPTIONS}
      />

      <Button onClick={onSortToggle}>
        Filing date: {sortDir === "desc" ? "Newest first ↓" : "Oldest first ↑"}
      </Button>
    </div>
  );
}
