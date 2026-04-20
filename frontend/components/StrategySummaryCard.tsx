import { AtAGlanceSummary } from "@/types";

const summaryFields: Array<{ key: keyof AtAGlanceSummary; label: string }> = [
  { key: "bestNextMove", label: "Best next move" },
  { key: "biggestGap", label: "Biggest gap" },
  { key: "strongestSchoolOpportunity", label: "Strongest school move" },
  { key: "bestFitSummerOption", label: "Best-fit summer option" },
  { key: "testingStance", label: "Testing stance" },
  { key: "collegeDirection", label: "College direction" },
];

export function StrategySummaryCard({ summary }: { summary: AtAGlanceSummary }) {
  return (
    <section className="glass-card p-6 sm:p-8">
      <p className="soft-label">Your Strategy At A Glance</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">What to focus on next</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryFields.map((field) => (
          <div key={field.key} className="rounded-[24px] border border-line bg-[#fffaf5] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{field.label}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{summary[field.key]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
