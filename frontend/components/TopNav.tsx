const navItems = [
  { label: "Home", href: "#top" },
  { label: "Pricing", href: "#intake" },
  { label: "Insights", href: "#workspace" },
  { label: "About Us", href: "https://www.vantion.com/" },
];

export function TopNav() {
  return (
    <header className="section-shell pt-5 sm:pt-6">
      <div className="flex items-center justify-between rounded-full border border-line bg-[#fcf7f1] px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <span className="rounded-full bg-[#2b221c] px-3 py-1.5 text-sm font-semibold text-[#f7efe5]">V</span>
          <span className="text-sm font-semibold tracking-[0.02em] text-ink">Vantion</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-slate-600 transition hover:text-ink"
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {item.label}
            </a>
          ))}
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
