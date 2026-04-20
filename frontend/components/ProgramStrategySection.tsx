"use client";

import { useMemo, useState } from "react";
import { MatchResult } from "@/types";
import { MatchResultsList } from "./MatchResultsList";
import { ProgramDetailDrawer } from "./ProgramDetailDrawer";
import { TopThreeComparisonTable } from "./TopThreeComparisonTable";

export function ProgramStrategySection({ matches }: { matches: MatchResult[] }) {
  const topMatches = matches.slice(0, 3);
  const [selectedId, setSelectedId] = useState(topMatches[0]?.program.id ?? "");

  const selectedMatch = useMemo(
    () => topMatches.find((match) => match.program.id === selectedId) ?? topMatches[0],
    [topMatches, selectedId],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
        <MatchResultsList matches={topMatches} selectedId={selectedId} onSelect={setSelectedId} />
        {selectedMatch ? <ProgramDetailDrawer match={selectedMatch} /> : null}
      </div>

      <details className="rounded-[24px] border border-line bg-[#fff8f2] p-4 sm:p-5">
        <summary className="cursor-pointer list-none text-sm font-semibold text-ink">Compare the top 3</summary>
        <div className="mt-4">
          <TopThreeComparisonTable matches={topMatches} />
        </div>
      </details>
    </div>
  );
}
