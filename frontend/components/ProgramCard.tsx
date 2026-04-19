import { MatchResult } from "@/types";
import { cn, labelize, scoreTone } from "@/lib/utils";

interface ProgramCardProps {
  match: MatchResult;
  isSelected: boolean;
  featured?: boolean;
  onSelect: () => void;
}

export function ProgramCard({ match, isSelected, featured, onSelect }: ProgramCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-[30px] border bg-[#fffdfa] p-6 text-left transition",
        isSelected ? "border-brand-200 bg-[#fff8f2]" : "border-line hover:border-[#ccb8a7]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {featured ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Top recommendation</p> : null}
          <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">{match.program.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {match.program.provider} • {labelize(match.program.mode)} • {match.program.location}
          </p>
        </div>
        <div className={cn("rounded-full border px-3 py-1 text-sm font-semibold", scoreTone(match.score.overall))}>
          Fit {match.score.overall}/100
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {match.program.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full border border-line bg-[#f8f1e8] px-3 py-1 text-xs font-medium text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[22px] bg-[#f8f1e8] p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Cost</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{match.program.costRange}</p>
        </div>
        <div className="rounded-[22px] bg-[#f8f1e8] p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Duration</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{match.program.duration}</p>
        </div>
        <div className="rounded-[22px] bg-[#f8f1e8] p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Deadline</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{match.program.deadline}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">Why it fits</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{match.ai.matchExplanation}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">What it adds</p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
            {match.strengthensProfile.slice(0, 2).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>Acceptance difficulty: {labelize(match.program.competitiveness)}</span>
        <span className="text-slate-300">•</span>
        <span>Major alignment: {match.score.majorAlignment >= 85 ? "strong" : match.score.majorAlignment >= 70 ? "medium" : "developing"}</span>
        <span className="text-slate-300">•</span>
        <span>Growth opportunity: {match.score.growthOpportunity >= 84 ? "high" : "medium"}</span>
      </div>
    </button>
  );
}
