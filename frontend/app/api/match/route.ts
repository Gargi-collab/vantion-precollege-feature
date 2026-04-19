import { NextResponse } from "next/server";
import { buildCounselorSummary, enrichMatchesWithInsights } from "@/lib/ai";
import { buildCounselorInsights, getMatches } from "@/lib/matching";
import { MatchResponse, StudentProfile } from "@/types";

export async function POST(request: Request) {
  try {
    const profile = (await request.json()) as StudentProfile;
    const matches = getMatches(profile);
    const enrichedMatches = await enrichMatchesWithInsights(profile, matches.slice(0, 6));
    const insights = buildCounselorInsights(profile, matches);

    const response: MatchResponse = {
      profile,
      insights,
      matches: enrichedMatches,
      topThreeIds: enrichedMatches.slice(0, 3).map((match) => match.program.id),
      counselorSummary: buildCounselorSummary(profile, insights, enrichedMatches[0]?.program.name),
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      {
        message: "We couldn't generate matches from that profile. Please review the form and try again.",
      },
      { status: 400 },
    );
  }
}
