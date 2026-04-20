import { PresetSelector } from "./PresetSelector";

interface HeroSectionProps {
  activePresetId?: string | null;
  onSelectPreset: (presetId: string) => void;
  presets: Array<{ id: string; label: string; description: string }>;
}

export function HeroSection({ activePresetId, onSelectPreset, presets }: HeroSectionProps) {
  return (
    <section className="section-shell pt-8 sm:pt-10 lg:pt-12">
      <div className="rounded-[36px] border border-line bg-[#fbf6f0] px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="max-w-4xl">
          <p className="inline-flex items-center rounded-full border border-line bg-[#fffaf4] px-4 py-2 text-sm text-slate-600">
            Pre-college planning
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-ink sm:text-6xl lg:text-[5.15rem] lg:leading-[0.96]">
            Plan your path to your target colleges.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Based on your goals, school opportunities, and current profile.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#intake"
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Start with a student profile
            </a>
            <span className="text-sm text-slate-500">Short answers first. Details when you want them.</span>
          </div>
        </div>

        <div className="mt-10 max-w-4xl">
          <PresetSelector activeId={activePresetId} onSelect={onSelectPreset} presets={presets} />
        </div>
      </div>
    </section>
  );
}
