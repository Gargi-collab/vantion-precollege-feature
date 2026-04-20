import { scoreTone } from "@/lib/utils";
import { ProgramRecommendation } from "@/types";

export function RecommendationCard({ recommendation }: { recommendation: ProgramRecommendation }) {
  const { program, fitScore } = recommendation;
  const cost = program.tuitionUsd ? `$${program.tuitionUsd.toLocaleString()}` : "Not listed";

  return (
    <article className="rounded-[28px] border border-line bg-[#fffdfa] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-ink">{program.name}</h4>
          <p className="mt-1 text-sm text-slate-600">{program.institution}</p>
        </div>
        <div className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${scoreTone(fitScore)}`}>
          {fitScore}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[program.primaryField, program.format, cost, program.duration].map((item) => (
          <span key={item} className="rounded-full border border-line bg-[#faf2e9] px-3 py-1.5 text-xs font-medium text-slate-700">
            {item}
          </span>
        ))}
      </div>

      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
        {recommendation.whyItFits.slice(0, 2).map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>

      <p className="mt-4 text-sm text-slate-600">
        <span className="font-medium text-ink">Tradeoff:</span> {recommendation.caution}
      </p>
    </article>
  );
}
