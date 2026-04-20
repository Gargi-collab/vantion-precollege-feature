import { ActionPlan } from "@/types";

export function ActionPlanPanel({ plan }: { plan: ActionPlan }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-ink">This semester</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {plan.thisSemester.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-ink">This summer</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {plan.thisSummer.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] border border-line bg-[#f8f1e8] p-5">
          <h3 className="text-sm font-semibold text-ink">Biggest first priority</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">{plan.biggestFirstPriority}</p>
        </div>

        <div className="rounded-[24px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-ink">Milestones to watch</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {plan.milestones.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <details className="rounded-[24px] border border-line bg-[#fff8f2] p-5">
        <summary className="cursor-pointer list-none text-sm font-semibold text-ink">Fallback options</summary>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          {plan.fallbackOptions.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
