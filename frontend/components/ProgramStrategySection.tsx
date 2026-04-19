"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MatchResult } from "@/types";
import { MatchResultsList } from "./MatchResultsList";
import { ProfileImpactPanel } from "./ProfileImpactPanel";
import { ProgramDetailDrawer } from "./ProgramDetailDrawer";
import { TopThreeComparisonTable } from "./TopThreeComparisonTable";

type ProgramView = "matches" | "compare" | "impact";

export function ProgramStrategySection({ matches }: { matches: MatchResult[] }) {
  const [selectedId, setSelectedId] = useState(matches[0]?.program.id ?? "");
  const [activeView, setActiveView] = useState<ProgramView>("matches");

  const selectedMatch = useMemo(
    () => matches.find((match) => match.program.id === selectedId) ?? matches[0],
    [matches, selectedId],
  );

  return (
    <section id="program-match" className="glass-card p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="soft-label">Pre-College Program Match</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Pick a summer option that does real work</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Summer is one part of the plan. Use it to fill a gap, not to do everything.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "matches", label: "Matches" },
            { id: "compare", label: "Compare Top 3" },
            { id: "impact", label: "Profile Impact" },
          ].map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setActiveView(view.id as ProgramView)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                activeView === view.id ? "border-line bg-[#efe2d2] text-ink" : "border-line bg-[#fffdfa] text-slate-600 hover:bg-[#fbf3ea]",
              )}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeView === "matches" ? (
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <MatchResultsList matches={matches} selectedId={selectedId} onSelect={setSelectedId} />
            {selectedMatch ? <ProgramDetailDrawer match={selectedMatch} /> : null}
          </div>
        ) : null}

        {activeView === "compare" ? <TopThreeComparisonTable matches={matches.slice(0, 3)} /> : null}

        {activeView === "impact" && selectedMatch ? <ProfileImpactPanel match={selectedMatch} /> : null}
      </div>
    </section>
  );
}
