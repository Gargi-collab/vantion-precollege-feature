import { ActionPlan } from "@/types";

export function ActionPlanPanel({ plan }: { plan: ActionPlan }) {
  return (
    <section id="action-plan" className="glass-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="soft-label">Action Plan</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Turn strategy into a roadmap</h2>
        </div>
        <button type="button" className="rounded-full border border-line bg-[#fffaf4] px-4 py-2 text-sm font-medium text-slate-700">
          Save top priorities
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-slate-900">This semester</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {plan.thisSemester.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-slate-900">This summer</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {plan.thisSummer.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[26px] border border-line bg-[#f8f1e8] p-5">
          <h3 className="text-sm font-semibold text-slate-900">First priority</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">{plan.biggestFirstPriority}</p>
        </div>
        <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-slate-900">Milestones to watch</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {plan.milestones.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <details className="mt-4 rounded-[26px] border border-line bg-[#fff8f2] p-5">
        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">Fallback options</summary>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          {plan.fallbackOptions.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
