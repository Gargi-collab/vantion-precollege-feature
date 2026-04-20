import { scoreTone } from "@/lib/utils";
import { ProgramRecommendation } from "@/types";

function metaValue(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="rounded-[20px] border border-line bg-[#fff8f2] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

export function TopMatchCard({ recommendation }: { recommendation: ProgramRecommendation }) {
  const { program, fitScore, whyItFits, bestFor, caution } = recommendation;
  const cost = program.tuitionUsd ? `$${program.tuitionUsd.toLocaleString()}` : "Not listed";
  const location = program.format === "online" ? "Online" : `${program.city}, ${program.stateOrCountry}`;

  return (
    <div className="glass-card overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="soft-label">Top Match</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">{program.name}</h3>
          <p className="mt-2 text-sm text-slate-600">{program.institution}</p>
        </div>
        <div className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold ${scoreTone(fitScore)}`}>
          Fit score {fitScore}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {metaValue("Field", program.primaryField)}
        {metaValue("Cost", cost)}
        {metaValue("Format", program.format)}
        {metaValue("Location", location)}
        {metaValue("Duration", program.duration)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold text-ink">Why it fits</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {whyItFits.map((reason) => (
              <li key={reason} className="rounded-[18px] border border-line bg-[#fffaf5] px-4 py-3">
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-line bg-[#fffaf5] p-5">
            <p className="text-sm font-semibold text-ink">Best for</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{bestFor}</p>
          </div>

          <div className="rounded-[24px] border border-line bg-[#fffaf5] p-5">
            <p className="text-sm font-semibold text-ink">Watch-out</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{caution}</p>
          </div>

          <div className="rounded-[24px] border border-line bg-[#fffaf5] p-5">
            <p className="text-sm font-semibold text-ink">Matched on</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {recommendation.matchedOn.map((item) => (
                <span key={item} className="rounded-full border border-line bg-[#f4e6d7] px-3 py-1.5 text-xs font-medium text-ink">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-line bg-[#fdf8f2] p-5">
        <p className="text-sm text-slate-700">{program.description}</p>
      </div>
    </div>
  );
}
