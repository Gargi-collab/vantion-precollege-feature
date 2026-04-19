import { StrategicSummary } from "@/types";

export function StrategicSummaryPanel({ summary }: { summary: StrategicSummary }) {
  return (
    <section id="strategic-summary" className="glass-card p-6 sm:p-8">
      <p className="soft-label">Strategic Summary</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Top take</h2>
      <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-700">{summary.profileSnapshot}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-slate-900">Strongest assets</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {summary.strongestAssets.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-slate-900">Biggest gaps</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {summary.biggestGaps.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[26px] border border-line bg-[#f8f1e8] p-5">
          <h3 className="text-sm font-semibold text-slate-900">What matters now</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {summary.whatMattersMost.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-line bg-[#fff8f2] p-6">
        <h3 className="text-sm font-semibold text-slate-900">Best next move</h3>
        <p className="mt-3 text-sm leading-6 text-slate-700">{summary.recommendedDirection}</p>
      </div>
    </section>
  );
}
