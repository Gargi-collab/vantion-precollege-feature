import { CounselorInsights, MatchResult, StudentProfile } from "@/types";

function asSentenceList(items: string[]) {
  return items.length ? items.join(", ") : "your current profile priorities";
}

function getScenario(profile: StudentProfile) {
  const text = [profile.dreamMajor, ...profile.academicInterests, ...profile.careerInterests].join(" ").toLowerCase();
  if (/(computer|software|ai|data|machine learning|cyber)/.test(text)) return "cs";
  if (/(engineering|robotics|mechanical|electrical|aerospace|civil)/.test(text)) return "engineering";
  if (/(biology|medicine|health|pre-med|neuroscience|public health|biomedical)/.test(text)) return "premed";
  if (/(business|finance|entrepreneur|product|economics|marketing)/.test(text)) return "business";
  if (/(policy|government|international|law|politics|civic)/.test(text)) return "policy";
  if (/(history|english|philosophy|writing|humanities)/.test(text)) return "humanities";
  if (/(film|media|creative|art|design|journalism)/.test(text)) return "creative";
  return "general";
}

function buildMockProgramInsights(profile: StudentProfile, match: Omit<MatchResult, "ai">) {
  const { program, score, strengthensProfile } = match;
  const scenario = getScenario(profile);
  const fitLabel = score.overall >= 85 ? "especially strong" : score.overall >= 74 ? "well-balanced" : "practical";
  const weakestAreas = profile.weaknesses.length ? profile.weaknesses.slice(0, 2).join(" and ") : "profile depth";

  const scenarioExplanations: Record<string, string> = {
    cs: `${program.name} is a strong CS pick. It adds real technical work and better proof than a generic summer class.`,
    engineering: `${program.name} makes sense for engineering. It adds building, design, or problem-solving you can point to later.`,
    premed: `${program.name} works well for a pre-health path. It adds science or care exposure the current profile still needs.`,
    business: `${program.name} is a good business fit. It turns interest into action, which matters more than saying you like entrepreneurship.`,
    policy: `${program.name} fits a policy path. It adds voice, writing, or civic work that reads clearly on an application.`,
    humanities: `${program.name} is a strong humanities option. It adds depth in writing, reading, or research.`,
    creative: `${program.name} is useful here because it can lead to real output. That matters more than broad participation.`,
    general: `${program.name} looks like a ${fitLabel} option. It fits the direction and helps where the school year may fall short.`,
  };

  const gapMap: Record<string, string> = {
    cs: `Main gap: ${weakestAreas}. This helps by ${strengthensProfile[0] || "adding technical proof"}.`,
    engineering: `Main gap: ${weakestAreas}. This adds a stronger hands-on signal.`,
    premed: `Main gap: ${weakestAreas}. This makes the health story feel more real.`,
    business: `Main gap: ${weakestAreas}. This adds initiative and visible ownership.`,
    policy: `Main gap: ${weakestAreas}. This adds better material for writing and leadership.`,
    humanities: `Main gap: ${weakestAreas}. This gives the profile more intellectual shape.`,
    creative: `Main gap: ${weakestAreas}. This can turn interest into actual work.`,
    general: `Main gap: ${weakestAreas}. This helps by ${strengthensProfile[0] || "adding a clearer signal"}.`,
  };

  const impactMap: Record<string, string> = {
    cs: "Best upside: more proof, less just interest.",
    engineering: "Best upside: a more hands-on profile.",
    premed: "Best upside: a clearer bridge from classes to real health interest.",
    business: "Best upside: stronger initiative and leadership proof.",
    policy: "Best upside: better material for essays and activity lists.",
    humanities: "Best upside: more voice and depth.",
    creative: "Best upside: clearer output and identity.",
    general: "Best upside: better major fit and stronger application material.",
  };

  return {
    matchExplanation: scenarioExplanations[scenario],
    gapAnalysis: gapMap[scenario],
    impactSummary: impactMap[scenario],
    nextActions: [
      `Keep ${program.name} on the shortlist with one cheaper and one safer option.`,
      `Write a plain answer for why ${profile.dreamMajor.toLowerCase()} matters right now.`,
      `Keep building through ${asSentenceList(profile.academicInterests.slice(0, 2))} during the school year.`,
      `Aim to finish before the ${program.deadline} deadline.`,
    ],
    drawbacks: program.drawbacks.slice(0, 2),
    alternatives: [],
  };
}

function buildMockCounselorSummary(profile: StudentProfile, insights: CounselorInsights, topProgramName?: string) {
  const lead = insights.atGlance.bestNextMove;
  const programNote = topProgramName ? ` Summer option: ${topProgramName}.` : "";
  const collegeNote = profile.dreamUniversities.length ? ` College direction: ${insights.atGlance.collegeDirection}` : "";
  return `${lead}${programNote}${collegeNote}`.trim();
}

async function generateWithOpenAI(profile: StudentProfile, match: Omit<MatchResult, "ai">) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildMockProgramInsights(profile, match);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.55,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are Vantion, a concise and strategic AI counselor for high school students. Return JSON with keys: matchExplanation, gapAnalysis, impactSummary, nextActions, drawbacks, alternatives.",
          },
          {
            role: "user",
            content: JSON.stringify({
              studentProfile: profile,
              program: match.program,
              score: match.score,
              strengths: match.strengthensProfile,
            }),
          },
        ],
      }),
    });

    if (!response.ok) return buildMockProgramInsights(profile, match);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return buildMockProgramInsights(profile, match);

    const parsed = JSON.parse(content);
    const fallback = buildMockProgramInsights(profile, match);
    return {
      matchExplanation: parsed.matchExplanation || fallback.matchExplanation,
      gapAnalysis: parsed.gapAnalysis || fallback.gapAnalysis,
      impactSummary: parsed.impactSummary || fallback.impactSummary,
      nextActions: Array.isArray(parsed.nextActions) ? parsed.nextActions.slice(0, 4) : fallback.nextActions,
      drawbacks: Array.isArray(parsed.drawbacks) ? parsed.drawbacks.slice(0, 3) : match.program.drawbacks.slice(0, 2),
      alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives.slice(0, 3) : [],
    };
  } catch {
    return buildMockProgramInsights(profile, match);
  }
}

export async function enrichMatchesWithInsights(profile: StudentProfile, baseMatches: Omit<MatchResult, "ai">[]) {
  const enriched = await Promise.all(
    baseMatches.map(async (match, index) => {
      const ai = await generateWithOpenAI(profile, match);
      if (!ai.alternatives.length) {
        ai.alternatives = baseMatches
          .filter((candidate) => candidate.program.id !== match.program.id)
          .slice(index + 1, index + 4)
          .map((candidate) => candidate.program.name);
      }
      return { ...match, ai };
    }),
  );

  return enriched;
}

export function buildCounselorSummary(profile: StudentProfile, insights: CounselorInsights, topProgramName?: string) {
  return buildMockCounselorSummary(profile, insights, topProgramName);
}
