import colleges from "@/data/colleges.json";
import programs from "@/data/programs.json";
import {
  ActionPlan,
  AtAGlanceSummary,
  CollegeListStrategy,
  CollegeRecommendation,
  CounselorInsights,
  EssayStrategy,
  MatchResult,
  PreCollegeProgram,
  PrioritizedOpportunity,
  SchoolOpportunityStrategy,
  ScoreBreakdown,
  StrategicSummary,
  StudentProfile,
  TestingStrategy,
} from "@/types";

const PROGRAMS = programs as PreCollegeProgram[];
const COLLEGES = colleges as Array<{
  name: string;
  region: string;
  bucket: "reach" | "target" | "safety";
  selectivity: "ultra" | "high" | "medium" | "broad";
  majors: string[];
  vibes: string[];
  testing: "important" | "helpful" | "optional";
}>;

const budgetWeights = { low: 1, moderate: 2, high: 3, flexible: 4 };
const selectivityWeights = { ultra: 4, high: 3, medium: 2, broad: 1 };
const gpaMidpoint: Record<string, number> = {
  "3.9+": 3.95,
  "3.6-3.8": 3.7,
  "3.3-3.5": 3.4,
  "3.0-3.2": 3.1,
  "below 3.0": 2.8,
};

type Scenario =
  | "cs"
  | "engineering"
  | "premed"
  | "business"
  | "policy"
  | "humanities"
  | "creative"
  | "general";

type GapKey = "rigor" | "research" | "leadership" | "service" | "voice" | "hands-on" | "direction";

type ScoredOpportunity = PrioritizedOpportunity & { score: number };

function normalizeWords(values: string[]) {
  return values.map((value) => value.toLowerCase().trim()).filter(Boolean);
}

function includesAny(source: string[], targets: string[]) {
  return source.some((item) =>
    targets.some((target) => {
      const sourceValue = item.toLowerCase();
      const targetValue = target.toLowerCase();
      return sourceValue.includes(targetValue) || targetValue.includes(sourceValue);
    }),
  );
}

function majorTerms(profile: StudentProfile) {
  return normalizeWords([profile.dreamMajor, ...profile.academicInterests, ...profile.careerInterests]);
}

function profileWords(profile: StudentProfile) {
  return normalizeWords([
    profile.dreamMajor,
    ...profile.academicInterests,
    ...profile.careerInterests,
    ...profile.extracurriculars,
    ...profile.projectsAwardsCompetitions,
    ...profile.strengths,
    ...profile.weaknesses,
  ]);
}

function getScenario(profile: StudentProfile): Scenario {
  const text = majorTerms(profile).join(" ");
  if (/(computer|software|ai|data|machine learning|cyber)/.test(text)) return "cs";
  if (/(engineering|robotics|mechanical|electrical|aerospace|civil|biomedical engineering)/.test(text)) return "engineering";
  if (/(biology|medicine|health|pre-med|neuroscience|public health|biomedical)/.test(text)) return "premed";
  if (/(business|finance|entrepreneur|product|economics|marketing)/.test(text)) return "business";
  if (/(policy|government|international|law|politics|civic)/.test(text)) return "policy";
  if (/(history|english|philosophy|writing|humanities)/.test(text)) return "humanities";
  if (/(film|media|creative|art|design|journalism)/.test(text)) return "creative";
  return "general";
}

function advancedCourseCount(profile: StudentProfile) {
  return profile.coursesAvailable.filter((course) => /(ap|ib|honors|dual)/i.test(course)).length;
}

function leadershipDepth(profile: StudentProfile) {
  return profile.leadershipRoles.length + profile.leadershipOpportunities.filter((item) => /(captain|officer|lead|editor|chair|president|secretary|treasurer)/i.test(item)).length;
}

function projectDepth(profile: StudentProfile) {
  return profile.projectsAwardsCompetitions.length + profile.extracurriculars.filter((item) => /(project|app|research|publication|business|podcast|initiative)/i.test(item)).length;
}

function hasWeakness(profile: StudentProfile, pattern: RegExp) {
  return profile.weaknesses.some((item) => pattern.test(item.toLowerCase()));
}

function hasActivity(profile: StudentProfile, pattern: RegExp) {
  return [...profile.extracurriculars, ...profile.clubsAvailable, ...profile.leadershipRoles].some((item) => pattern.test(item.toLowerCase()));
}

function topSelectiveGoals(profile: StudentProfile) {
  return profile.dreamUniversities.some((school) =>
    ["stanford", "carnegie mellon", "mit", "johns hopkins", "duke", "brown", "georgetown", "northwestern", "rice", "princeton", "yale"].some((name) =>
      school.toLowerCase().includes(name),
    ),
  );
}

function inferBiggestGap(profile: StudentProfile, scenario: Scenario): GapKey {
  const advancedCourses = advancedCourseCount(profile);
  const leadership = leadershipDepth(profile);

  if (hasWeakness(profile, /(research|lab|independent study)/)) return "research";
  if (hasWeakness(profile, /(leadership|ownership|initiative)/) || leadership === 0) return "leadership";
  if (hasWeakness(profile, /(rigor|quant|math|coursework|testing)/) || (advancedCourses < 2 && topSelectiveGoals(profile))) return "rigor";

  if (scenario === "premed" && !hasActivity(profile, /(hosa|hospital|clinic|health|service|volunteer)/)) return "service";
  if ((scenario === "policy" || scenario === "humanities") && !hasActivity(profile, /(debate|model un|newspaper|journal|speech|writing)/)) return "voice";
  if (scenario === "engineering" && !hasActivity(profile, /(robotics|maker|build|engineering|science olympiad)/) && projectDepth(profile) === 0) return "hands-on";
  if (scenario === "business" && leadership < 2) return "leadership";

  return "direction";
}

function rankLabel(score: number) {
  if (score >= 78) return "high" as const;
  if (score >= 56) return "medium" as const;
  return "low" as const;
}

function scenarioCourseKeywords(scenario: Scenario) {
  switch (scenario) {
    case "cs":
      return ["computer", "calculus", "statistics", "physics", "data"];
    case "engineering":
      return ["physics", "calculus", "engineering", "design", "computer"];
    case "premed":
      return ["biology", "chemistry", "anatomy", "statistics", "psychology"];
    case "business":
      return ["economics", "statistics", "business", "finance", "calculus"];
    case "policy":
      return ["government", "history", "english", "politics", "sociology"];
    case "humanities":
      return ["english", "history", "philosophy", "writing", "seminar"];
    case "creative":
      return ["film", "media", "art", "design", "english"];
    default:
      return ["ap", "ib", "honors", "dual"];
  }
}

function scenarioActivityKeywords(scenario: Scenario) {
  switch (scenario) {
    case "cs":
      return ["robotics", "coding", "math", "hack", "science"];
    case "engineering":
      return ["robotics", "engineering", "science", "math", "maker"];
    case "premed":
      return ["hosa", "science", "health", "service", "hospital"];
    case "business":
      return ["deca", "business", "entrepreneur", "government", "yearbook"];
    case "policy":
      return ["debate", "model un", "government", "newspaper", "speech"];
    case "humanities":
      return ["newspaper", "literary", "debate", "history", "journal"];
    case "creative":
      return ["film", "theater", "newspaper", "art", "media"];
    default:
      return ["government", "service", "club", "captain"];
  }
}

function activityPriority(profile: StudentProfile, activity: string): ScoredOpportunity {
  const scenario = getScenario(profile);
  const gap = inferBiggestGap(profile, scenario);
  const value = activity.toLowerCase();
  let score = 24;

  for (const keyword of scenarioActivityKeywords(scenario)) {
    if (value.includes(keyword)) score += 18;
  }

  if (/(captain|officer|editor|chair|lead|president|secretary|treasurer)/.test(value)) score += 10;
  if (gap === "leadership" && /(captain|officer|editor|chair|lead|president|secretary|treasurer|government)/.test(value)) score += 12;
  if (gap === "service" && /(service|key club|hospital|volunteer|hosa)/.test(value)) score += 10;
  if (gap === "voice" && /(debate|model un|newspaper|journal|speech)/.test(value)) score += 10;
  if (gap === "hands-on" && /(robotics|maker|engineering|science olympiad)/.test(value)) score += 10;
  if (value.includes("nhs") && !/(officer|lead)/.test(value)) score -= 6;

  const priority = rankLabel(score);
  const rationaleByPriority: Record<Scenario, Record<typeof priority, string>> = {
    cs: {
      high: "Best lane for real output or technical ownership.",
      medium: "Useful if it turns into a project or mentoring role.",
      low: "Easy for this to stay generic.",
    },
    engineering: {
      high: "Good place to build, test, or lead something tangible.",
      medium: "Helpful if it becomes a real role, not just attendance.",
      low: "Lower signal than stronger build work.",
    },
    premed: {
      high: "Strong for service, science, or health-facing maturity.",
      medium: "Useful if the student stays consistent inside it.",
      low: "Less useful than stronger health or service work.",
    },
    business: {
      high: "Strong for ownership, initiative, or visible leadership.",
      medium: "Useful if it leads to results, not just membership.",
      low: "Can read as generic unless the student does more with it.",
    },
    policy: {
      high: "Strong for voice, leadership, or public-facing work.",
      medium: "Helpful if the student contributes more than attendance.",
      low: "Lower value unless it leads to writing, speaking, or organizing.",
    },
    humanities: {
      high: "Good for writing, discussion, or intellectual depth.",
      medium: "Worth it if the student publishes, creates, or leads.",
      low: "Less useful than stronger writing-heavy options.",
    },
    creative: {
      high: "Best case: this leads to work people can actually see.",
      medium: "Useful if it creates output, not just involvement.",
      low: "Weak fit unless it ties back to made work.",
    },
    general: {
      high: "Good upside here. This can become a real signal.",
      medium: "Useful if the student builds responsibility inside it.",
      low: "Could turn into filler if it stays shallow.",
    },
  };

  return { name: activity, priority, rationale: rationaleByPriority[scenario][priority], score };
}

function coursePriority(profile: StudentProfile, course: string): ScoredOpportunity {
  const scenario = getScenario(profile);
  const gap = inferBiggestGap(profile, scenario);
  const value = course.toLowerCase();
  let score = 26;

  for (const keyword of scenarioCourseKeywords(scenario)) {
    if (value.includes(keyword)) score += 18;
  }

  if (/(ap|ib|honors|dual)/.test(value)) score += 16;
  if (gap === "rigor" && /(ap|ib|honors|dual|calculus|statistics|chemistry|physics)/.test(value)) score += 12;
  if (topSelectiveGoals(profile) && /(ap|ib|honors|dual)/.test(value)) score += 8;

  const priority = rankLabel(score);
  const rationaleByPriority: Record<Scenario, Record<typeof priority, string>> = {
    cs: {
      high: "High signal for CS. Good rigor and clear relevance.",
      medium: "Helpful, especially next to projects or research.",
      low: "Fine if it matters to you, but not a top CS lever.",
    },
    engineering: {
      high: "Strong pick for engineering. Good rigor and fit.",
      medium: "Useful support if build work is happening elsewhere.",
      low: "Lower priority than the best math and science options.",
    },
    premed: {
      high: "Good pre-health rigor. This helps the transcript.",
      medium: "Helpful, but not the strongest proof on its own.",
      low: "Lower value unless it balances the rest of the schedule.",
    },
    business: {
      high: "Good business support. Adds useful analytical signal.",
      medium: "Solid complement if ownership is growing elsewhere.",
      low: "Less useful than stronger quant or writing choices.",
    },
    policy: {
      high: "Good for reading, writing, and policy thinking.",
      medium: "Helpful, but it needs leadership or writing next to it.",
      low: "Lower priority unless it adds rigor or a clear angle.",
    },
    humanities: {
      high: "Strong humanities signal. Good for voice and depth.",
      medium: "Useful, especially if it connects to writing.",
      low: "Less useful than the best reading and writing options.",
    },
    creative: {
      high: "Good for craft or storytelling range.",
      medium: "Helpful support if the student is also making work outside class.",
      low: "Not the clearest academic signal for this path.",
    },
    general: {
      high: "Good rigor. Helps the transcript look more intentional.",
      medium: "Helpful, but do not let it crowd out stronger options.",
      low: "Lower leverage for the current goals.",
    },
  };

  return { name: course, priority, rationale: rationaleByPriority[scenario][priority], score };
}

function computeBreakdown(profile: StudentProfile, program: PreCollegeProgram): ScoreBreakdown {
  const scenario = getScenario(profile);
  const gap = inferBiggestGap(profile, scenario);
  const majorList = majorTerms(profile);
  const studentWords = profileWords(profile);
  const desiredStyles = normalizeWords(profile.desiredStyles);
  const targetCollegeTerms = normalizeWords([...profile.dreamUniversities, ...profile.dreamPrograms]);

  const subjectHitCount = program.subjectAreas.filter((area) => includesAny(majorList, [area])).length;
  const scenarioBonus =
    scenario === "cs" && includesAny(program.subjectAreas, ["computer science", "artificial intelligence", "data science"])
      ? 10
      : scenario === "engineering" && includesAny(program.subjectAreas, ["engineering", "robotics", "design"])
        ? 10
        : scenario === "premed" && includesAny(program.subjectAreas, ["medicine", "biology", "public health", "health"])
          ? 10
          : scenario === "business" && includesAny(program.subjectAreas, ["business", "entrepreneurship", "economics", "product design"])
            ? 10
            : scenario === "policy" && includesAny(program.subjectAreas, ["public policy", "humanities", "international relations"])
              ? 10
              : scenario === "humanities" && includesAny(program.subjectAreas, ["writing", "humanities", "history"])
                ? 10
                : scenario === "creative" && includesAny(program.subjectAreas, ["film", "media", "design", "creative writing"])
                  ? 10
                  : 0;

  const dreamProgramBoost = profile.dreamPrograms.some((name) => program.name.toLowerCase().includes(name.toLowerCase())) ? 16 : 0;
  const gapBoost =
    gap === "research" && program.styleTags.includes("research")
      ? 14
      : gap === "leadership" && program.styleTags.includes("leadership")
        ? 12
        : gap === "service" && includesAny(program.subjectAreas, ["medicine", "public health", "social impact"])
          ? 12
          : gap === "voice" && includesAny(program.subjectAreas, ["writing", "public policy", "humanities"])
            ? 12
            : gap === "hands-on" && includesAny(program.subjectAreas, ["engineering", "robotics", "design"])
              ? 12
              : gap === "rigor" && program.competitiveness !== "emerging"
                ? 8
                : 0;

  const accessBoost =
    (!profile.localResearchAvailable && program.styleTags.includes("research") ? 8 : 0) +
    (!profile.internshipsAvailable && program.styleTags.includes("internship-like") ? 6 : 0) +
    (profile.budgetLevel === "low" && program.costBucket === "low" ? 8 : 0);

  const majorAlignment = Math.min(100, 42 + subjectHitCount * 20 + scenarioBonus + dreamProgramBoost);
  const gradeEligibility = program.gradeEligibility.includes(profile.gradeLevel) ? 100 : 18;

  const budgetDelta = budgetWeights[profile.budgetLevel] - budgetWeights[program.costBucket];
  const budgetCompatibility =
    budgetDelta >= 0
      ? Math.min(100, 88 + Math.max(0, 2 - budgetWeights[program.costBucket]) * 4)
      : Math.max(22, 86 + budgetDelta * 22);

  let locationPreference = 80;
  if (profile.locationPreference === "online only") {
    locationPreference = program.mode === "online" ? 100 : 32;
  } else if (profile.locationPreference !== "no strong preference") {
    locationPreference = program.region === profile.locationPreference || program.region === "online" ? 100 : 56;
  }

  const stylePreference = desiredStyles.length
    ? Math.min(100, 42 + program.styleTags.filter((style) => desiredStyles.includes(style.toLowerCase())).length * 18)
    : program.mode === "online" && profile.budgetLevel === "low"
      ? 88
      : 78;

  const competitivenessFit =
    profile.selectivityComfort === "reach-heavy"
      ? program.competitiveness === "high"
        ? 100
        : program.competitiveness === "medium"
          ? 82
          : 62
      : profile.selectivityComfort === "balanced"
        ? program.competitiveness === "medium"
          ? 100
          : 84
        : program.competitiveness === "emerging"
          ? 100
          : 76;

  const modePreference =
    profile.budgetLevel === "low" && program.mode === "online"
      ? 92
      : desiredStyles.includes("on-campus residential") && program.mode === "in-person"
        ? 94
        : 82;

  const targetCollegeRelevance = targetCollegeTerms.length
    ? Math.min(
        100,
        46 + program.targetCollegeSignals.filter((signal) => targetCollegeTerms.some((target) => signal.toLowerCase().includes(target))).length * 18,
      )
    : includesAny(program.targetCollegeSignals, normalizeWords(profile.dreamUniversities))
      ? 84
      : 70;

  const weaknessBoosts = studentWords.filter((word) =>
    includesAny([...program.benefits, ...program.skillsGained, ...program.tags, ...program.styleTags], [word]),
  ).length;
  const growthOpportunity = Math.min(100, 44 + weaknessBoosts * 10 + gapBoost + accessBoost);

  const minGpaPass = program.minGpa ? gpaMidpoint[profile.gpaRange] >= program.minGpa : true;
  const gpaAdjustment = minGpaPass ? 0 : -14;

  const overall = Math.round(
    majorAlignment * 0.22 +
      gradeEligibility * 0.08 +
      budgetCompatibility * 0.12 +
      locationPreference * 0.08 +
      stylePreference * 0.08 +
      competitivenessFit * 0.09 +
      modePreference * 0.05 +
      targetCollegeRelevance * 0.1 +
      growthOpportunity * 0.18 +
      gpaAdjustment,
  );

  return {
    overall: Math.max(18, Math.min(99, overall)),
    majorAlignment,
    gradeEligibility,
    budgetCompatibility,
    locationPreference,
    stylePreference,
    competitivenessFit,
    modePreference,
    targetCollegeRelevance,
    growthOpportunity,
  };
}

function summarizeStrengths(program: PreCollegeProgram, profile: StudentProfile) {
  const scenario = getScenario(profile);
  const gap = inferBiggestGap(profile, scenario);
  const items: string[] = [];

  if (gap === "research" && program.styleTags.includes("research")) items.push("adds research proof");
  if (gap === "leadership" && program.styleTags.includes("leadership")) items.push("adds clearer leadership evidence");
  if (gap === "hands-on" && includesAny(program.subjectAreas, ["engineering", "robotics", "design"])) items.push("adds hands-on depth");
  if (gap === "voice" && includesAny(program.subjectAreas, ["public policy", "writing", "humanities"])) items.push("sharpens writing and public voice");
  if (gap === "service" && includesAny(program.subjectAreas, ["health", "public health", "medicine"])) items.push("adds service or health exposure");
  if (includesAny(program.subjectAreas, [profile.dreamMajor])) items.push(`builds depth in ${profile.dreamMajor.toLowerCase()}`);
  if (profile.budgetLevel === "low" && program.costBucket === "low") items.push("keeps cost manageable");
  if (!items.length) items.push("turns interest into something concrete");

  return items.slice(0, 3);
}

function buildHighlights(score: ScoreBreakdown, program: PreCollegeProgram, profile: StudentProfile) {
  const highlights: string[] = [];
  if (score.majorAlignment >= 88) highlights.push("Strong major fit");
  if (score.budgetCompatibility >= 88) highlights.push("Budget works");
  if (score.growthOpportunity >= 84) highlights.push("Closes a real gap");
  if (profile.budgetLevel === "low" && program.mode === "online") highlights.push("Easy to access");
  if (topSelectiveGoals(profile) && score.targetCollegeRelevance >= 82) highlights.push("Useful for this school list");
  if (!highlights.length) highlights.push("Worth a closer look");
  return highlights.slice(0, 3);
}

function createImpactAreas(profile: StudentProfile, program: PreCollegeProgram) {
  const scenario = getScenario(profile);
  const researchBonus = program.styleTags.includes("research") ? 18 : 8;
  const leadershipBonus = program.styleTags.includes("leadership") ? 18 : 7;
  const majorBonus = includesAny(program.subjectAreas, [profile.dreamMajor]) ? 19 : 10;
  const depthBonus = scenario === "creative" ? 18 : 15;

  return [
    { area: "academic rigor" as const, before: 58, after: Math.min(95, 58 + researchBonus) },
    { area: "demonstrated interest" as const, before: 62, after: Math.min(95, 62 + 16) },
    { area: "extracurricular depth" as const, before: 56, after: Math.min(94, 56 + depthBonus) },
    { area: "leadership" as const, before: 50, after: Math.min(92, 50 + leadershipBonus) },
    { area: "major alignment" as const, before: 66, after: Math.min(97, 66 + majorBonus) },
  ];
}

function buildStrategicSummary(profile: StudentProfile): StrategicSummary {
  const scenario = getScenario(profile);
  const gap = inferBiggestGap(profile, scenario);
  const strongestAssets = [...profile.strengths.slice(0, 2), ...(profile.projectsAwardsCompetitions.length ? [profile.projectsAwardsCompetitions[0]] : [])].slice(0, 3);
  const biggestGaps = profile.weaknesses.slice(0, 3);

  const focusMap: Record<Scenario, string[]> = {
    cs: ["Back CS with real rigor.", "Go deep in one technical lane.", "Use summer to add proof."],
    engineering: ["Prioritize math, science, and build work.", "Show how you make or fix things.", "Keep the story grounded in projects."],
    premed: ["Pair science with service or health exposure.", "Avoid a profile that is only classroom-based.", "Use essays to show maturity."],
    business: ["Show initiative, not just interest.", "Pick roles with visible ownership.", "Use summer to build or lead something."],
    policy: ["Let writing and civic voice lead.", "Choose work that is public-facing.", "Keep the list grounded in fit."],
    humanities: ["Lean into reading, writing, and voice.", "Depth beats generic breadth.", "Pick summer options that add intellectual signal."],
    creative: ["Make work people can see.", "Choose output over broad participation.", "Let voice show up across the profile."],
    general: ["Choose fewer priorities.", "Build depth in one lane.", "Use summer to fix a real gap."],
  };

  const gapLabel: Record<GapKey, string> = {
    rigor: "rigor",
    research: "research depth",
    leadership: "leadership ownership",
    service: "service or health exposure",
    voice: "voice and writing signal",
    "hands-on": "hands-on proof",
    direction: "clear direction",
  };

  return {
    profileSnapshot: `${profile.gradeLevel}th grade, aiming at ${profile.dreamMajor || "a focused college path"}. Biggest job now: tighten the profile around ${gapLabel[gap]}.`,
    strongestAssets: strongestAssets.length ? strongestAssets : ["Clear upside, but the strongest assets still need to show up more clearly."],
    biggestGaps: biggestGaps.length ? biggestGaps : [`The profile needs more ${gapLabel[gap]}.`],
    whatMattersMost: focusMap[scenario],
    recommendedDirection: "Use the best school-based options first. Then add one summer move that fills the biggest remaining gap.",
  };
}

function buildSchoolOpportunityStrategy(profile: StudentProfile, matches: Omit<MatchResult, "ai">[]): SchoolOpportunityStrategy {
  const scoredCourses = profile.coursesAvailable.map((course) => coursePriority(profile, course)).sort((a, b) => b.score - a.score);
  const scoredActivities = profile.clubsAvailable.map((club) => activityPriority(profile, club)).sort((a, b) => b.score - a.score);
  const scenario = getScenario(profile);
  const gap = inferBiggestGap(profile, scenario);
  const topProgram = matches[0]?.program.name || "a strong-fit summer option";

  const leadershipFocusMap: Record<Scenario, string[]> = {
    cs: [`Aim for visible ownership in ${profile.leadershipOpportunities[0] || "a technical club"}.`, "A title without output is not enough here."],
    engineering: [`Pick a role tied to building or execution, like ${profile.leadershipOpportunities[0] || "a build-oriented activity"}.`, "Hands-on leadership matters more than admin work."],
    premed: [`Look for leadership where service or health responsibility is visible, like ${profile.leadershipOpportunities[0] || "a science or service role"}.`, "Dependability counts more than title count."],
    business: [`Choose a role where you can organize, launch, or influence outcomes through ${profile.leadershipOpportunities[0] || "one clear lane"}.`, "Ownership is the point."],
    policy: [`Pick leadership that makes speaking, writing, or organizing visible through ${profile.leadershipOpportunities[0] || "a public-facing role"}.`, "Voice and judgment matter more than titles."],
    humanities: ["Look for editorial, discussion, or community-facing leadership.", "One strong lane beats scattered involvement."],
    creative: ["Lead where you can shape output or present work publicly.", "The work matters more than the title."],
    general: [`Use ${profile.leadershipOpportunities[0] || "one meaningful role"} as the main leadership lane.`, "Depth and visible responsibility matter more than more titles."],
  };

  const lowValueAvailable = scoredActivities.filter((item) => item.priority === "low").slice(0, 2).map((item) => item.name);
  const deprioritize = lowValueAvailable.length
    ? lowValueAvailable.map((name) => `${name}: fine as a side activity, but not where most energy should go.`)
    : ["Generic membership without output.", "Anything that pulls time away from stronger priorities."];

  const topCourse = scoredCourses[0]?.name || "your strongest course option";
  const topActivity = scoredActivities[0]?.name || "one higher-signal activity";
  const externalMove =
    profile.internshipsAvailable
      ? "Try one local internship or shadowing lead if it beats the best school option."
      : profile.localResearchAvailable
        ? "Ask a teacher or local mentor about a small research-style project."
        : "Use an online or community-based option to add outside proof.";

  const gapOpeners: Record<GapKey, string> = {
    rigor: `At school: prioritize ${topCourse} and protect time for it.`,
    research: `At school: use ${topCourse} as the base and look for independent study or mentor-led work.`,
    leadership: `At school: turn ${topActivity} into a real ownership lane.`,
    service: `At school: build around ${topActivity} and stay consistent.`,
    voice: `At school: lean into ${topActivity} and produce something public.`,
    "hands-on": `At school: use ${topActivity} to make or build something real.`,
    direction: `At school: center the year around ${topCourse} and ${topActivity}.`,
  };

  return {
    priorityCourses: scoredCourses.map(({ name, priority, rationale }) => ({ name, priority, rationale })),
    priorityActivities: scoredActivities.map(({ name, priority, rationale }) => ({ name, priority, rationale })),
    leadershipFocus: leadershipFocusMap[scenario],
    deprioritize,
    gapClosure: [gapOpeners[gap], `Outside school: ${externalMove}`, `Summer: keep ${topProgram} near the top of the list.`],
  };
}

function buildTestingStrategy(profile: StudentProfile): TestingStrategy {
  const scenario = getScenario(profile);
  const selectiveTargets = profile.dreamUniversities.filter((school) =>
    COLLEGES.some((college) => college.name.toLowerCase() === school.toLowerCase() && selectivityWeights[college.selectivity] >= 3),
  );
  const testingSensitive = profile.dreamUniversities.some((school) =>
    COLLEGES.some((college) => college.name.toLowerCase() === school.toLowerCase() && college.testing !== "optional"),
  );

  let recommendation = "";
  if (profile.testSituation === "SAT taken" || profile.testSituation === "ACT taken") {
    recommendation = profile.testingConfidence === "low" ? "Retest only if the score is clearly holding this list back." : "Use the current score unless a retake has real upside.";
  } else if (testingSensitive && selectiveTargets.length > 0) {
    recommendation = "Take one real shot. A strong score could help this list.";
  } else if (profile.testingConfidence === "low") {
    recommendation = "Test-optional is fine if the rest of the profile gets sharper.";
  } else {
    recommendation = "Try one diagnostic, then decide if testing is worth the time.";
  }

  const whyMap: Record<Scenario, string> = {
    cs: "For CS, scores help most when they back up quant readiness.",
    engineering: "For engineering, they help when math rigor is a big part of the case.",
    premed: "For pre-med, testing helps only if the science profile is already solid.",
    business: "For business, it matters only if it adds clear academic signal.",
    policy: "Do not let test prep crowd out writing or leadership work.",
    humanities: "Here, voice and writing often matter more than scores.",
    creative: "For creative paths, scores are rarely the main differentiator.",
    general: "Scores help only if they clearly improve the case.",
  };

  const plan = [
    profile.testSituation === "no SAT/ACT yet" ? "Take one diagnostic and pick the better test." : "Check whether the current score is actually helping.",
    profile.testingConfidence === "low" ? "Use a short prep block, not endless retakes." : "Tie prep to one or two real dates.",
    selectiveTargets.length > 0 ? "Be honest about whether more prep time is worth it for the reach schools." : "If prep starts stealing time from better profile work, pull back.",
  ];

  const testOptionalView =
    testingSensitive && selectiveTargets.length > 0
      ? "Test-optional is still possible, but the rest of the profile needs to be sharp."
      : "Test-optional is reasonable here if classes, activities, and essays carry the case.";

  return { recommendation, whyItMatters: whyMap[scenario], plan, testOptionalView };
}

function buildEssayStrategy(profile: StudentProfile): EssayStrategy {
  const scenario = getScenario(profile);
  const themes = [...profile.personalStatementThemes, ...profile.majorExperiences].slice(0, 3);

  const themeFallbacks: Record<Scenario, string[]> = {
    cs: ["building something useful for other people", "moving from curiosity to disciplined problem-solving", "finding confidence through making"],
    engineering: ["learning by building and fixing", "turning frustration into design thinking", "becoming the person who solves practical problems"],
    premed: ["watching care up close", "service that changed what responsibility means", "learning empathy under pressure"],
    business: ["spotting problems and acting on them", "learning to lead through execution", "finding confidence through ownership"],
    policy: ["finding a public voice", "advocacy shaped by lived experience", "speaking up in community spaces"],
    humanities: ["an idea that changed perspective", "voice shaped by reading or writing", "making meaning from complexity"],
    creative: ["creating work as a way of understanding identity", "storytelling as agency", "finding style through experimentation"],
    general: ["a turning point that clarified direction", "growth through responsibility", "voice shaped by a real challenge"],
  };

  const strongDirections: Record<Scenario, string[]> = {
    cs: ["Start with one build, bug, or question that hooked you.", "Show the jump from tinkering to ownership."],
    engineering: ["Anchor the story in building, testing, or fixing something.", "Show how you think through constraints."],
    premed: ["Skip the generic 'I want to help people' essay.", "Focus on one moment that changed how you see care."],
    business: ["Build the story around initiative and ownership.", "Use concrete choices, tradeoffs, and results."],
    policy: ["Lead with voice, judgment, or one public question that became personal.", "Use writing or civic work to make it feel alive."],
    humanities: ["Center the essay on one idea or tension that stayed with you.", "Use scenes and reflection, not a list of books or classes."],
    creative: ["Show how making work changed the way you see things.", "Let process and risk matter more than passion statements."],
    general: ["Choose a story that shows values and direction.", "Use scenes and decisions, not abstract traits."],
  };

  const keepInMind = [
    "Avoid broad essays about loving learning or helping people.",
    "Better: one story with a real decision, scene, or consequence.",
    `Best: an essay that points toward ${profile.dreamMajor.toLowerCase()} without sounding like a resume.`,
  ];

  const nextSteps = [
    "Pick two angles and keep the one that feels least interchangeable.",
    "List moments, images, or decisions before drafting.",
    profile.essayWritingConfidence === "low" ? "Start with fragments and notes, not a polished draft." : "Draft fast, then cut anything generic.",
  ];

  return {
    promisingThemes: themes.length ? themes : themeFallbacks[scenario],
    narrativeDirections: strongDirections[scenario],
    genericVsDistinctive: keepInMind,
    nextSteps,
  };
}

function profileStrengthLevel(profile: StudentProfile) {
  const gpaScore = gpaMidpoint[profile.gpaRange] >= 3.9 ? 4 : gpaMidpoint[profile.gpaRange] >= 3.7 ? 3.4 : gpaMidpoint[profile.gpaRange] >= 3.4 ? 2.8 : gpaMidpoint[profile.gpaRange] >= 3.1 ? 2.2 : 1.7;
  const rigorScore = Math.min(0.7, advancedCourseCount(profile) * 0.16);
  const depthScore = Math.min(0.6, projectDepth(profile) * 0.12 + leadershipDepth(profile) * 0.08);
  return gpaScore + rigorScore + depthScore;
}

function schoolFitReason(college: (typeof COLLEGES)[number], profile: StudentProfile) {
  const scenario = getScenario(profile);
  const scenarioPhrases: Record<Scenario, string> = {
    cs: "technical depth",
    engineering: "hands-on rigor",
    premed: "science and pre-health support",
    business: "initiative and applied learning",
    policy: "writing, leadership, and public service",
    humanities: "voice, reading, and discussion",
    creative: "output and creative identity",
    general: "fit with the current goals",
  };
  return `Good fit for ${scenarioPhrases[scenario]}. Strong on ${college.vibes.slice(0, 2).join(" and ")}.`;
}

function collegeReason(college: (typeof COLLEGES)[number], bucket: "reach" | "target" | "safety", profile: StudentProfile): CollegeRecommendation {
  const base =
    bucket === "reach"
      ? "High bar, but the fit is real."
      : bucket === "target"
        ? "Realistic if the next year gets sharper."
        : "More attainable, still useful for this path.";
  return { name: college.name, reasoning: `${base} ${schoolFitReason(college, profile)}` };
}

function buildCollegeListStrategy(profile: StudentProfile): CollegeListStrategy {
  const scenario = getScenario(profile);
  const regionPref = profile.locationPreference === "no strong preference" ? null : profile.locationPreference;
  const ranked = COLLEGES.map((college) => {
    let score = 24;

    if (includesAny(college.majors, [profile.dreamMajor])) score += 34;
    if (profile.dreamUniversities.some((name) => name.toLowerCase() === college.name.toLowerCase())) score += 28;
    if (regionPref && college.region === regionPref) score += 10;
    if (profile.budgetLevel === "low" && includesAny(college.vibes, ["value", "public", "co-op"])) score += 8;
    if (profile.testSituation === "not planning yet" && college.testing === "optional") score += 6;
    if (gpaMidpoint[profile.gpaRange] < 3.5 && college.selectivity === "ultra") score -= 8;
    if (gpaMidpoint[profile.gpaRange] >= 3.9 && college.bucket === "reach") score += 4;
    if (scenario === "cs" && includesAny(college.majors, ["computer science", "data science"])) score += 10;
    if (scenario === "engineering" && includesAny(college.majors, ["engineering", "biomedical engineering"])) score += 10;
    if (scenario === "premed" && includesAny(college.majors, ["biology", "medicine", "public health", "neuroscience"])) score += 10;
    if (scenario === "business" && includesAny(college.majors, ["business", "economics", "entrepreneurship"])) score += 10;
    if (scenario === "policy" && includesAny(college.majors, ["public policy", "international relations", "political science"])) score += 10;
    if (scenario === "humanities" && includesAny(college.majors, ["humanities", "history", "creative writing", "english"])) score += 10;
    if (scenario === "creative" && includesAny(college.majors, ["film", "media", "design", "creative writing"])) score += 10;
    if (scenario === "cs" && includesAny(college.vibes, ["technical depth", "problem solving", "maker", "innovation"])) score += 12;
    if (scenario === "engineering" && includesAny(college.vibes, ["hands-on", "maker", "technical rigor", "applied learning"])) score += 12;
    if (scenario === "premed" && includesAny(college.vibes, ["pre-health", "research", "service", "science"])) score += 12;
    if (scenario === "business" && includesAny(college.vibes, ["co-op", "initiative", "applied learning", "career focus", "value"])) score += 12;
    if (scenario === "policy" && includesAny(college.vibes, ["policy", "public service", "writing", "discussion", "city access"])) score += 12;
    if (scenario === "humanities" && includesAny(college.vibes, ["writing", "discussion", "intellectual voice", "academic seriousness"])) score += 12;
    if (scenario === "creative" && includesAny(college.vibes, ["portfolio", "style", "output", "creative practice"])) score += 12;

    return { college, score };
  }).sort((a, b) => b.score - a.score);

  function pick(bucket: "reach" | "target" | "safety", count: number) {
    return ranked
      .filter((item) => item.college.bucket === bucket)
      .slice(0, count)
      .map((item) => collegeReason(item.college, bucket, profile));
  }

  return {
    reach: pick("reach", 3),
    target: pick("target", 3),
    safety: pick("safety", 3),
  };
}

function buildCollegeDirection(profile: StudentProfile, colleges: CollegeListStrategy) {
  const regionPref = profile.locationPreference === "no strong preference" ? "mixed" : profile.locationPreference;
  if (profile.budgetLevel === "low") {
    return `Keep the reaches, but lean on value-heavy ${regionPref === "mixed" ? "targets" : `${regionPref} targets`} and clear safeties.`;
  }
  if (profile.selectivityComfort === "reach-heavy") {
    return "Keep a few ambitious reaches, but do not skip grounded targets.";
  }
  if (gpaMidpoint[profile.gpaRange] < 3.5) {
    return `Stay balanced. Let ${colleges.target[0]?.name || "your targets"} and ${colleges.safety[0]?.name || "your safeties"} do real work.`;
  }
  return `Build around fit-first targets like ${colleges.target[0]?.name || "your top target"} and one or two steadier safeties.`;
}

function buildActionPlan(profile: StudentProfile, school: SchoolOpportunityStrategy, matches: Omit<MatchResult, "ai">[]): ActionPlan {
  const scenario = getScenario(profile);
  const topCourse = school.priorityCourses[0]?.name || "your strongest course option";
  const topActivity = school.priorityActivities[0]?.name || "one high-signal activity";
  const topProgram = matches[0]?.program.name || "a strong-fit summer option";

  const summerMove: Record<Scenario, string> = {
    cs: "ship something visible",
    engineering: "build or document a real project",
    premed: "pair science with health or service exposure",
    business: "launch, lead, or test an initiative",
    policy: "write, speak, or organize around a public question",
    humanities: "produce thoughtful writing or research",
    creative: "finish work people can actually see",
    general: "come out with one concrete artifact",
  };

  return {
    thisSemester: [`Prioritize ${topCourse}.`, `Put more energy into ${topActivity}.`, `Fix the biggest gap before adding new low-signal commitments.`],
    thisSummer: [`Keep ${topProgram} near the top of the list.`, `Use the summer to ${summerMove[scenario]}.`, "Come out of summer with something concrete to show."],
    biggestFirstPriority: `Build a clearer ${profile.dreamMajor.toLowerCase()} story through rigor, one focused activity lane, and one strong summer move.`,
    milestones: [
      "Course registration and final schedule decisions",
      "Leadership applications or officer timelines",
      "Summer program and scholarship deadlines",
      profile.testSituation === "no SAT/ACT yet" || profile.testSituation === "not planning yet" ? "Testing decision checkpoint" : "Score or retest checkpoint",
    ],
    fallbackOptions: [
      "If cost blocks the first-choice program, pair a lower-cost option with a self-directed project.",
      "If selectivity blocks the top reach, double down on school rigor and visible ownership.",
      "If outside options fall through, use school and local options to make something concrete.",
    ],
  };
}

function buildAtGlanceSummary(
  profile: StudentProfile,
  strategicSummary: StrategicSummary,
  school: SchoolOpportunityStrategy,
  matches: Omit<MatchResult, "ai">[],
  testing: TestingStrategy,
  colleges: CollegeListStrategy,
): AtAGlanceSummary {
  const scenario = getScenario(profile);
  const gap = inferBiggestGap(profile, scenario);
  const topCourse = school.priorityCourses[0]?.name || "your top course";
  const topActivity = school.priorityActivities[0]?.name || "your top activity";
  const topProgram = matches[0];

  const moveByGap: Record<GapKey, string> = {
    rigor: `Protect ${topCourse} and treat rigor as the main school-year job.`,
    research: `Use ${topCourse} as the base, then add one real research step.`,
    leadership: `Turn ${topActivity} into a clear leadership lane.`,
    service: `Build around ${topActivity} and stay consistent.`,
    voice: `Use ${topActivity} to create something public and specific.`,
    "hands-on": `Center the plan on ${topActivity} and one build-heavy summer option.`,
    direction: strategicSummary.recommendedDirection,
  };

  const gapText: Record<GapKey, string> = {
    rigor: "Rigor still needs to rise.",
    research: "There is not enough research or independent academic proof yet.",
    leadership: "Leadership is still too light or too title-based.",
    service: "The service or health side still needs real depth.",
    voice: "The application still needs a clearer writing or civic voice.",
    "hands-on": "There is not enough hands-on proof yet.",
    direction: "The profile needs a tighter central lane.",
  };

  const strongestSchoolOpportunity =
    gap === "leadership" || gap === "service" || gap === "voice" || gap === "hands-on" ? topActivity : topCourse;

  return {
    bestNextMove: moveByGap[gap],
    biggestGap: gapText[gap],
    strongestSchoolOpportunity,
    bestFitSummerOption: topProgram ? `${topProgram.program.name} — ${topProgram.reasoningHighlights[0].toLowerCase()}.` : "No summer option picked yet.",
    testingStance: testing.recommendation,
    collegeDirection: buildCollegeDirection(profile, colleges),
  };
}

export function getMatches(profile: StudentProfile): Omit<MatchResult, "ai">[] {
  return PROGRAMS.map((program) => {
    const score = computeBreakdown(profile, program);
    return {
      program,
      score,
      reasoningHighlights: buildHighlights(score, program, profile),
      strengthensProfile: summarizeStrengths(program, profile),
      impactAreas: createImpactAreas(profile, program),
    };
  }).sort((a, b) => b.score.overall - a.score.overall);
}

export function buildCounselorInsights(profile: StudentProfile, matches: Omit<MatchResult, "ai">[]): CounselorInsights {
  const schoolOpportunityStrategy = buildSchoolOpportunityStrategy(profile, matches);
  const testingStrategy = buildTestingStrategy(profile);
  const essayStrategy = buildEssayStrategy(profile);
  const collegeListStrategy = buildCollegeListStrategy(profile);
  const strategicSummary = buildStrategicSummary(profile);
  const actionPlan = buildActionPlan(profile, schoolOpportunityStrategy, matches);

  return {
    atGlance: buildAtGlanceSummary(profile, strategicSummary, schoolOpportunityStrategy, matches, testingStrategy, collegeListStrategy),
    strategicSummary,
    schoolOpportunityStrategy,
    testingStrategy,
    essayStrategy,
    collegeListStrategy,
    actionPlan,
  };
}
