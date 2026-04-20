import { ProgramRecommendation } from "@/types";

function cell(value: string | number | null | undefined) {
  return value === null || value === undefined || value === "" ? "—" : value;
}

export function ComparePanel({ recommendations }: { recommendations: ProgramRecommendation[] }) {
  if (recommendations.length === 0) return null;

  return (
    <div className="glass-card overflow-x-auto p-6">
      <div className="mb-5">
        <p className="soft-label">Quick Compare</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">Top options side by side</h3>
      </div>

      <table className="min-w-full border-separate border-spacing-y-2 text-left">
        <thead>
          <tr className="text-xs uppercase tracking-[0.16em] text-slate-500">
            <th className="px-3 py-2">Program</th>
            <th className="px-3 py-2">Score</th>
            <th className="px-3 py-2">Cost</th>
            <th className="px-3 py-2">Format</th>
            <th className="px-3 py-2">Duration</th>
            <th className="px-3 py-2">Selectivity</th>
            <th className="px-3 py-2">Best use</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((recommendation) => (
            <tr key={recommendation.program.id} className="rounded-[18px] bg-[#fffaf5] text-sm text-slate-700">
              <td className="rounded-l-[18px] px-3 py-4">
                <p className="font-semibold text-ink">{recommendation.program.name}</p>
                <p className="mt-1 text-xs text-slate-500">{recommendation.program.institution}</p>
              </td>
              <td className="px-3 py-4 font-medium text-ink">{recommendation.fitScore}</td>
              <td className="px-3 py-4">{cell(recommendation.program.tuitionUsd ? `$${recommendation.program.tuitionUsd.toLocaleString()}` : "Not listed")}</td>
              <td className="px-3 py-4">{cell(recommendation.program.format)}</td>
              <td className="px-3 py-4">{cell(recommendation.program.duration)}</td>
              <td className="px-3 py-4">{cell(recommendation.program.selectivity)}</td>
              <td className="rounded-r-[18px] px-3 py-4">{recommendation.whyItFits[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
