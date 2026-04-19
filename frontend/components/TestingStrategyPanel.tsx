import { TestingStrategy } from "@/types";

export function TestingStrategyPanel({ strategy }: { strategy: TestingStrategy }) {
  return (
    <section id="testing-strategy" className="glass-card p-6 sm:p-8">
      <p className="soft-label">SAT / ACT Strategy</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">How testing fits the plan</h2>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-line bg-[#fff8f2] p-6">
          <h3 className="text-sm font-semibold text-slate-900">Top take</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">{strategy.recommendation}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">{strategy.whyItMatters}</p>
        </div>
        <div className="rounded-[28px] border border-line bg-[#fffdfa] p-6">
          <h3 className="text-sm font-semibold text-slate-900">Plan</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {strategy.plan.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <details className="mt-4 rounded-[26px] border border-line bg-[#fffdfa] p-5">
        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">Test-optional view</summary>
        <p className="mt-3 text-sm leading-6 text-slate-600">{strategy.testOptionalView}</p>
      </details>
    </section>
  );
}
