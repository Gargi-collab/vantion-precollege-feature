import { MatchResult } from "@/types";
import { ProgramCard } from "./ProgramCard";

interface MatchResultsListProps {
  matches: MatchResult[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function MatchResultsList({ matches, selectedId, onSelect }: MatchResultsListProps) {
  return (
    <div className="grid gap-4">
      {matches.map((match, index) => (
        <ProgramCard
          key={match.program.id}
          match={match}
          featured={index === 0}
          isSelected={selectedId === match.program.id}
          onSelect={() => onSelect(match.program.id)}
        />
      ))}
    </div>
  );
}
