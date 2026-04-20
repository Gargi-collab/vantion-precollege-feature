import { SchoolOpportunityStrategy } from "@/types";

function PriorityPill({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles =
    priority === "high"
      ? "bg-[#f3e7d9] text-ink border-line"
      : priority === "medium"
        ? "bg-[#fff8f2] text-slate-700 border-line"
        : "bg-[#fffdfa] text-slate-500 border-line";

  return <span className={`rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${styles}`}>{priority}</span>;
}

function OpportunityList({
  title,
  items,
}: {
  title: string;
  items: SchoolOpportunityStrategy["priorityCourses"];
}) {
  return (
    <div className="rounded-[24px] border border-line bg-[#fffaf5] p-5">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.name} className="rounded-[20px] border border-line bg-[#fffdfa] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              <PriorityPill priority={item.priority} />
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SchoolOpportunityPanel({ strategy }: { strategy: SchoolOpportunityStrategy }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <OpportunityList title="Priority courses" items={strategy.priorityCourses} />
        <OpportunityList title="Priority activities" items={strategy.priorityActivities} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[24px] border border-line bg-[#f8f1e8] p-5">
          <h3 className="text-sm font-semibold text-ink">Leadership focus</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {strategy.leadershipFocus.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-line bg-[#fffdfa] p-5">
          <h3 className="text-sm font-semibold text-ink">Deprioritize</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {strategy.deprioritize.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-line bg-[#fff8f2] p-5">
          <h3 className="text-sm font-semibold text-ink">Close the gap</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {strategy.gapClosure.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
