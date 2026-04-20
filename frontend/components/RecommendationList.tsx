import { ProgramRecommendation } from "@/types";
import { RecommendationCard } from "./RecommendationCard";

export function RecommendationList({ recommendations }: { recommendations: ProgramRecommendation[] }) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-line bg-[#fffaf4] p-6 text-sm text-slate-600">
        No backup picks yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <RecommendationCard key={recommendation.program.id} recommendation={recommendation} />
      ))}
    </div>
  );
}
