import { useState } from "react";
import FilingsExplorer from "./components/FilingsExplorer";
import SummaryView from "./components/SummaryView";
import Button from "./common/Button";

type Tab = "filings" | "summary";

const TABS: ReadonlyArray<{ id: Tab; label: string }> = [
  { id: "filings", label: "Filings" },
  { id: "summary", label: "Summary" },
];

function App() {
  const [tab, setTab] = useState<Tab>("filings");

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">SEC Filings Explorer</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {TABS.map((t) => (
          <Button
            key={t.id}
            className={`rounded-none! border-x-0! border-t-0! border-b-2! -mb-px ${
              tab === t.id
                ? "border-gray-900! text-gray-900"
                : "border-transparent! text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {tab === "filings" ? <FilingsExplorer /> : <SummaryView />}
    </div>
  );
}

export default App;
