import { CollegeListStrategy, CollegeRecommendation } from "@/types";

function Bucket({ title, items }: { title: string; items: CollegeRecommendation[] }) {
  return (
    <div className="rounded-[24px] border border-line bg-[#fffdfa] p-5">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.name} className="rounded-[20px] bg-[#fff8f2] p-4">
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
    <div className="grid gap-4 xl:grid-cols-3">
      <Bucket title="Reach" items={strategy.reach} />
      <Bucket title="Target" items={strategy.target} />
      <Bucket title="Safe" items={strategy.safety} />
    </div>
  );
}
