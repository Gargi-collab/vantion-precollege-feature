import { MatchResponse } from "@/types";
import { ComparePanel } from "./ComparePanel";
import { RecommendationList } from "./RecommendationList";
import { TopMatchCard } from "./TopMatchCard";

export function ResultsWorkspace({ data }: { data: MatchResponse }) {
  if (!data.topMatch) {
    return (
      <section id="results" className="section-shell mt-10 pb-16 sm:mt-12">
        <div className="glass-card p-8">
          <p className="soft-label">No Strong Matches</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">Try widening one constraint</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            We checked the current CSV catalog, but nothing cleared the bar for this profile. Try opening up format, budget, or location.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="results" className="section-shell mt-10 pb-16 sm:mt-12">
      <div className="max-w-4xl">
        <p className="soft-label">Your Matches</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">Best-fit programs for this student</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Curated from {data.consideredCount} programs in the CSV. {data.eligibleCount} cleared the basic grade and format checks.
        </p>
      </div>

      <div className="mt-6">
        <TopMatchCard recommendation={data.topMatch} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
        <div className="glass-card p-6">
          <p className="soft-label">Backups</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">A few other strong options</h3>
          <div className="mt-5">
            <RecommendationList recommendations={data.backupMatches} />
          </div>
        </div>

        <ComparePanel recommendations={data.compareMatches} />
      </div>
    </section>
  );
}
