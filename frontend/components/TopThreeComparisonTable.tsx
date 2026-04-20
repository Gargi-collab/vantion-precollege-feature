import { MatchResult } from "@/types";
import { labelize } from "@/lib/utils";

export function TopThreeComparisonTable({ matches }: { matches: MatchResult[] }) {
  return (
    <div className="rounded-[24px] border border-line bg-[#fffdfa] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="soft-label">Compare Top 3</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">Decision view</h3>
        </div>
        <div className="rounded-full border border-line bg-[#fffaf4] px-4 py-2 text-sm text-slate-600">Best for a quick side-by-side read</div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-left">
          <thead>
            <tr className="text-xs uppercase tracking-[0.18em] text-slate-500">
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Fit</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Best for</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.program.id} className="rounded-2xl bg-[#fffdfa]">
                <td className="rounded-l-3xl px-4 py-4">
                  <div className="font-semibold text-slate-900">{match.program.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{match.program.provider}</div>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-900">{match.score.overall}/100</td>
                <td className="px-4 py-4 text-sm text-slate-600">{match.program.costRange}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{labelize(match.program.mode)}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{labelize(match.program.competitiveness)}</td>
                <td className="rounded-r-3xl px-4 py-4 text-sm text-slate-600">{match.reasoningHighlights[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
