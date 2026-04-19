import { CollegeListStrategy, CollegeRecommendation } from "@/types";

function Bucket({ title, items }: { title: string; items: CollegeRecommendation[] }) {
  return (
    <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.name} className="rounded-[22px] bg-[#fff8f2] p-4">
            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CollegeListPanel({ strategy }: { strategy: CollegeListStrategy }) {
  return (
    <section id="college-list" className="glass-card p-6 sm:p-8">
      <p className="soft-label">Reach / Target / Safe</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Build a smarter list</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Bucket title="Reach schools" items={strategy.reach} />
        <Bucket title="Target schools" items={strategy.target} />
        <Bucket title="Safety schools" items={strategy.safety} />
      </div>
    </section>
  );
}
