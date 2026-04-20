import { EssayStrategy } from "@/types";

export function EssayStrategyPanel({ strategy }: { strategy: EssayStrategy }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-ink">Possible themes</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {strategy.promisingThemes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-line bg-[#fff8f2] p-5">
          <h3 className="text-sm font-semibold text-ink">What feels strong</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {strategy.narrativeDirections.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-ink">Keep in mind</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {strategy.genericVsDistinctive.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-[24px] border border-line bg-[#f8f1e8] p-5">
        <h3 className="text-sm font-semibold text-ink">Next step</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
          {strategy.nextSteps.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
