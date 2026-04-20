import { TestingStrategy } from "@/types";

export function TestingStrategyPanel({ strategy }: { strategy: TestingStrategy }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
      <div className="rounded-[24px] border border-line bg-[#fff8f2] p-5">
        <h3 className="text-sm font-semibold text-ink">Recommended stance</h3>
        <p className="mt-3 text-sm leading-6 text-slate-700">{strategy.recommendation}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{strategy.whyItMatters}</p>
      </div>

      <div className="rounded-[24px] border border-line bg-[#fffdfa] p-5">
        <h3 className="text-sm font-semibold text-ink">What to do</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          {strategy.plan.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>

        <details className="mt-4 rounded-[20px] border border-line bg-[#fffaf5] p-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-ink">Test-optional view</summary>
          <p className="mt-3 text-sm leading-6 text-slate-600">{strategy.testOptionalView}</p>
        </details>
      </div>
    </div>
  );
}
