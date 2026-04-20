import { buildRecommendation } from "@/lib/buildRecommendationReasons";
import { getProgramsFromCsv } from "@/lib/parseProgramsCsv";
import { filterAndScorePrograms } from "@/lib/scorePrograms";
import { MatchResponse, ProgramRecommendation, StudentProfile } from "@/types";

function toRecommendation(profile: StudentProfile, item: ReturnType<typeof filterAndScorePrograms>["rankedPrograms"][number]): ProgramRecommendation {
  const details = buildRecommendation(profile, item.program, item.scoreBreakdown);
  return {
    ...details,
    fitScore: item.fitScore,
  };
}

export function buildMatches(profile: StudentProfile): MatchResponse {
  const programs = getProgramsFromCsv();
  const scored = filterAndScorePrograms(profile, programs);
  const recommendations = scored.rankedPrograms.slice(0, 4).map((item) => toRecommendation(profile, item));

  return {
    profile,
    topMatch: recommendations[0] ?? null,
    backupMatches: recommendations.slice(1),
    compareMatches: recommendations.slice(0, 3),
    consideredCount: scored.consideredCount,
    eligibleCount: scored.eligibleCount,
    generatedAt: new Date().toISOString(),
  };
}
