import { EssayStrategy } from "@/types";

export function EssayStrategyPanel({ strategy }: { strategy: EssayStrategy }) {
  return (
    <section id="essay-direction" className="glass-card p-6 sm:p-8">
      <p className="soft-label">Personal Statement Direction</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Find the strongest essay lane</h2>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-slate-900">Best themes</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {strategy.promisingThemes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[26px] border border-line bg-[#fff8f2] p-5">
          <h3 className="text-sm font-semibold text-slate-900">Directions</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {strategy.narrativeDirections.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-slate-900">Keep / avoid</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {strategy.genericVsDistinctive.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-line bg-[#f8f1e8] p-5">
        <h3 className="text-sm font-semibold text-slate-900">Next steps</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          {strategy.nextSteps.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
