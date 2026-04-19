export function HeroSection() {
  return (
    <section className="section-shell pt-6 sm:pt-8 lg:pt-10">
      <div className="rounded-[34px] border border-line/80 bg-hero px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-line bg-[#fffaf4] px-4 py-2 text-sm text-slate-600">
              Pre-college planning
            </div>

            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-ink sm:text-6xl lg:text-[5.2rem] lg:leading-[0.96]">
              Plan your path to your target colleges.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Based on your goals, school opportunities, and current profile.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#intake"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Start with a student profile
              </a>
              <div className="text-sm text-slate-500">
                Clear priorities. Less guesswork.
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[30px] border border-line bg-[#fffaf5] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                What this helps with
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink">
                A simpler way to decide what matters most.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Focus on the right courses, activities, and summer options for your goals.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">School</p>
                <p className="mt-3 text-2xl font-semibold text-ink">Priorities</p>
              </div>

              <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Summer</p>
                <p className="mt-3 text-2xl font-semibold text-ink">Options</p>
              </div>

              <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Next step</p>
                <p className="mt-3 text-2xl font-semibold text-ink">Focused</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}