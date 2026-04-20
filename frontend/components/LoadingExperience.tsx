export function LoadingExperience() {
  return (
    <section className="section-shell mt-8">
      <div className="glass-card overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="soft-label">Building The Plan</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Reviewing the student’s real options</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Looking at the school context, the biggest gap, and the few summer options worth real attention.
            </p>
            <div className="mt-6 space-y-3">
              {["Finding the top school priorities", "Ranking the best summer options", "Putting the next steps in order"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-[22px] border border-line bg-[#fffdfa] px-4 py-3">
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-500" style={{ animationDelay: `${index * 120}ms` }} />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-[28px] border border-line bg-[#fffdfa] p-5">
                <div className="h-4 w-24 animate-pulse rounded-full bg-[#efe4d8]" />
                <div className="mt-4 h-7 w-3/4 animate-pulse rounded-xl bg-[#efe4d8]" />
                <div className="mt-3 h-20 animate-pulse rounded-2xl bg-[#f6eee5]" />
                <div className="mt-4 h-8 w-32 animate-pulse rounded-full bg-[#f7e2d1]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
