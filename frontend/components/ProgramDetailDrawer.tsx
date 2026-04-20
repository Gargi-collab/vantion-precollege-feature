import { MatchResult } from "@/types";
import { labelize } from "@/lib/utils";

interface ProgramDetailDrawerProps {
  match: MatchResult;
}

export function ProgramDetailDrawer({ match }: ProgramDetailDrawerProps) {
  return (
    <aside className="glass-card h-fit p-6 lg:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="soft-label">Selected Program</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{match.program.name}</h3>
          <p className="mt-2 text-sm text-slate-500">
            {match.program.provider} • {match.program.location} • {labelize(match.program.mode)}
          </p>
        </div>
        <div className="rounded-full bg-[#f3e7d9] px-4 py-2 text-sm font-semibold text-ink">{match.score.overall}/100 fit</div>
      </div>

      <div className="mt-5 rounded-[24px] border border-line bg-[#fff8f2] p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Quick read</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{match.ai.gapAnalysis}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[24px] bg-[#f8f1e8] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Eligibility</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Grades {match.program.gradeEligibility.join(", ")}
            {match.program.minGpa ? ` • minimum GPA ${match.program.minGpa}` : " • no stated GPA floor"}
          </p>
        </div>
        <div className="rounded-[24px] bg-[#f8f1e8] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Estimated competitiveness</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{labelize(match.program.competitiveness)}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Skills gained</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {match.program.skillsGained.map((skill) => (
              <span key={skill} className="rounded-full border border-line bg-[#fffdfa] px-3 py-1 text-xs font-medium text-slate-600">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">What it could add</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">{match.program.collegeApplicationValue}</p>
        </div>

        <details className="rounded-[24px] border border-line bg-[#fffdfa] p-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">Program details</summary>
          <div className="mt-3 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">About this program</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{match.program.description}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Best for</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{match.program.idealStudentType}</p>
            </div>
          </div>
        </details>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-line bg-[#f8f1e8] p-4">
            <h4 className="text-sm font-semibold text-ink">Things to keep in mind</h4>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              {match.ai.drawbacks.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] border border-line bg-[#fdf8f2] p-4">
            <h4 className="text-sm font-semibold text-ink">Alternative options</h4>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              {match.ai.alternatives.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
