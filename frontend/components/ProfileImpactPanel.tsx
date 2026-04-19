import { MatchResult } from "@/types";

export function ProfileImpactPanel({ match }: { match: MatchResult }) {
  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="soft-label">Profile Impact</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">How this could shape your college profile</h3>
        </div>
        <div className="rounded-full border border-line bg-[#fff8f2] px-4 py-2 text-sm font-medium text-slate-700">
          Selected program: {match.program.name}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {match.impactAreas.map((impact) => (
          <div key={impact.area} className="rounded-[24px] border border-line bg-[#fffdfa] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold capitalize text-slate-900">{impact.area}</p>
              <p className="text-sm font-medium text-slate-500">
                {impact.before} → {impact.after}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-[#cdb8a3]" style={{ width: `${impact.before}%` }} />
              </div>
              <div className="h-3 rounded-full metric-bar">
                <div className="h-3 rounded-full bg-brand-500" style={{ width: `${impact.after}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[28px] border border-line bg-[#f8f1e8] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Counselor Insight</p>
        <p className="mt-3 text-base leading-8 text-slate-700">{match.ai.impactSummary}</p>
      </div>
    </div>
  );
}
