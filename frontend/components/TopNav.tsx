export function TopNav() {
  return (
    <header className="section-shell pt-5 sm:pt-6">
      <div className="flex items-center justify-between rounded-full border border-line/90 bg-[#fdf8f2] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#2f241e] px-3 py-1.5 text-sm font-semibold text-[#f8f1e9]">V</div>
          <span className="text-sm font-semibold tracking-[0.02em] text-ink">Vantion</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#intake" className="text-sm text-slate-600 transition hover:text-ink">
            Student Profile
          </a>
          <a href="#workspace" className="text-sm text-slate-600 transition hover:text-ink">
            Matches
          </a>
          <a href="#workspace" className="text-sm text-slate-600 transition hover:text-ink">
            Action Plan
          </a>
        </nav>

        <a
          href="#intake"
          className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Try the feature
        </a>
      </div>
    </header>
  );
}
