import colleges from "@/data/colleges.json";
import programs from "@/data/programs.json";
import {
  ActionPlan,
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

function normalizeWords(values: string[]) {
  return values.map((value) => value.toLowerCase().trim()).filter(Boolean);
}

function includesAny(source: string[], targets: string[]) {
  return source.some((item) => targets.some((target) => item.toLowerCase().includes(target.toLowerCase())));
}

function majorTerms(profile: StudentProfile) {
  return normalizeWords([profile.dreamMajor, ...profile.academicInterests, ...profile.careerInterests]);
}

function getScenario(profile: StudentProfile): Scenario {
  const text = majorTerms(profile).join(" ");
  if (/(computer|software|ai|data|machine learning|cyber)/.test(text)) return "cs";
  if (/(engineering|robotics|mechanical|electrical|aerospace|civil)/.test(text)) return "engineering";
  if (/(biology|medicine|health|pre-med|neuroscience|public health|biomedical)/.test(text)) return "premed";
  if (/(business|finance|entrepreneur|product|economics|marketing)/.test(text)) return "business";
  if (/(policy|government|international|law|politics|civic)/.test(text)) return "policy";
  if (/(history|english|philosophy|writing|humanities)/.test(text)) return "humanities";
  if (/(film|media|creative|art|design|journalism)/.test(text)) return "creative";
  return "general";
}

function rankLabel(score: number) {
  if (score >= 78) return "high" as const;
  if (score >= 55) return "medium" as const;
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
      return ["economics", "statistics", "business", "calculus", "finance"];
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
      return ["deca", "business", "entrepreneur", "government", "finance"];
    case "policy":
      return ["debate", "model un", "government", "newspaper", "speech"];
    case "humanities":
      return ["newspaper", "literary", "debate", "history", "journal"];
    case "creative":
      return ["film", "newspaper", "theater", "art", "media"];
    default:
      return ["government", "service", "club", "captain"];
  }
}

function coursePriority(profile: StudentProfile, course: string): PrioritizedOpportunity {
  const value = course.toLowerCase();
  const scenario = getScenario(profile);
  let score = 28;
  for (const keyword of scenarioCourseKeywords(scenario)) {
    if (value.includes(keyword)) score += 18;
  }
  if (value.includes("ap") || value.includes("ib") || value.includes("dual")) score += 14;
  if (profile.dreamUniversities.some((school) => ["mit", "stanford", "carnegie mellon", "johns hopkins", "brown"].some((name) => school.toLowerCase().includes(name)))) {
    if (value.includes("ap") || value.includes("ib") || value.includes("dual") || value.includes("honors")) score += 8;
  }
  const priority = rankLabel(score);
  const rationaleMap: Record<Scenario, Record<typeof priority, string>> = {
    cs: {
      high: "High signal for CS. Adds rigor and helps the transcript.",
      medium: "Helpful, especially next to projects or research.",
      low: "Fine if it matters to you, but not a top CS lever.",
    },
    engineering: {
      high: "Strong pick for an engineering path. Good rigor.",
      medium: "Useful support, especially with build work nearby.",
      low: "Lower priority than the best math and science options.",
    },
    premed: {
      high: "Good for a pre-health transcript. Adds science depth.",
      medium: "Helpful, but not the strongest proof on its own.",
      low: "Lower value unless it helps balance the rest of the schedule.",
    },
    business: {
      high: "Good fit for business. Adds useful analytical signal.",
      medium: "Solid support course if leadership or initiative is growing elsewhere.",
      low: "Less useful than stronger quantitative or ownership-based choices.",
    },
    policy: {
      high: "Good for reading, writing, and policy thinking.",
      medium: "Helpful, but it needs speaking, writing, or leadership next to it.",
      low: "Lower priority unless it adds rigor or a clear angle.",
    },
    humanities: {
      high: "Strong humanities signal. Good for voice and depth.",
      medium: "Useful, especially if it connects to writing or discussion.",
      low: "Less useful than the best reading and writing options.",
    },
    creative: {
      high: "Good for craft. Gives better raw material for future work.",
      medium: "Helpful support if the student is also making things outside class.",
      low: "Not the clearest academic signal for this path.",
    },
    general: {
      high: "Good rigor. Helps the transcript look more intentional.",
      medium: "Helpful, but do not let it crowd out stronger options.",
      low: "Lower leverage for the current goals.",
    },
  };

  return { name: course, priority, rationale: rationaleMap[scenario][priority] };
}

function activityPriority(profile: StudentProfile, activity: string): PrioritizedOpportunity {
  const value = activity.toLowerCase();
  const scenario = getScenario(profile);
  let score = 26;
  for (const keyword of scenarioActivityKeywords(scenario)) {
    if (value.includes(keyword)) score += 18;
  }
  if (value.includes("government") || value.includes("captain") || value.includes("editor") || value.includes("officer")) score += 10;
  if (profile.weaknesses.some((item) => item.toLowerCase().includes("leadership")) && /(government|officer|captain|editor|lead)/.test(value)) score += 12;
  if (profile.weaknesses.some((item) => item.toLowerCase().includes("service")) && /(service|key club|nhs)/.test(value)) score += 8;
  if (value.includes("nhs") && !/(officer|lead)/.test(value)) score -= 6;
  const priority = rankLabel(score);

  const rationaleMap: Record<Scenario, Record<typeof priority, string>> = {
    cs: {
      high: "High value here. It can lead to output, depth, or both.",
      medium: "Worth it if it turns into a project or real responsibility.",
      low: "Easy for this to become generic participation.",
    },
    engineering: {
      high: "Good place to build, lead, or solve something real.",
      medium: "Helpful if it becomes a real role, not just attendance.",
      low: "Lower signal than hands-on engineering work.",
    },
    premed: {
      high: "Good fit. Adds service, science, or health-facing maturity.",
      medium: "Useful if the student sticks with it and grows inside it.",
      low: "Less useful than science, service, or health-related work.",
    },
    business: {
      high: "Strong lane for initiative, leadership, or execution.",
      medium: "Good if it leads to ownership or visible results.",
      low: "Can read as generic unless the student does more with it.",
    },
    policy: {
      high: "Strong for voice, leadership, or civic credibility.",
      medium: "Helpful if the student does more than show up.",
      low: "Lower value unless it connects to writing, speaking, or organizing.",
    },
    humanities: {
      high: "Good for writing, voice, or discussion depth.",
      medium: "Worth it if the student publishes, creates, or leads.",
      low: "Less useful than the best writing-heavy options.",
    },
    creative: {
      high: "Best case: this leads to actual work people can see.",
      medium: "Helpful if it creates output, not just membership.",
      low: "Weak fit unless it connects back to made work.",
    },
    general: {
      high: "Good upside here. This could become a real signal.",
      medium: "Useful if the student builds responsibility inside it.",
      low: "Could turn into resume filler if it stays shallow.",
    },
  };

  return { name: activity, priority, rationale: rationaleMap[scenario][priority] };
}

function computeBreakdown(profile: StudentProfile, program: PreCollegeProgram): ScoreBreakdown {
  const majorList = majorTerms(profile);
  const weaknessTerms = normalizeWords(profile.weaknesses);
  const desiredStyles = normalizeWords(profile.desiredStyles);
  const targetCollegeTerms = normalizeWords([...profile.dreamUniversities, ...profile.dreamPrograms]);
  const scenario = getScenario(profile);

  const subjectHitCount = program.subjectAreas.filter((area) => includesAny(majorList, [area])).length;
  const dreamProgramBoost = profile.dreamPrograms.some((name) => program.name.toLowerCase().includes(name.toLowerCase())) ? 18 : 0;
  const schoolGapBoost =
    profile.localResearchAvailable === false && program.styleTags.includes("research") ? 8 : 0 +
    (profile.internshipsAvailable === false && program.styleTags.includes("internship-like") ? 6 : 0);

  const majorAlignment = Math.min(100, 42 + subjectHitCount * 22 + (includesAny(program.tags, majorList) ? 10 : 0) + dreamProgramBoost);
  const gradeEligibility = program.gradeEligibility.includes(profile.gradeLevel) ? 100 : 18;
  const budgetDelta = budgetWeights[profile.budgetLevel] - budgetWeights[program.costBucket];
  const budgetCompatibility = budgetDelta >= 0 ? 100 : Math.max(25, 82 + budgetDelta * 18);

  let locationPreference = 80;
  if (profile.locationPreference === "online only") {
    locationPreference = program.mode === "online" ? 100 : 35;
  } else if (profile.locationPreference !== "no strong preference") {
    locationPreference = program.region === profile.locationPreference || program.region === "online" ? 100 : 55;
  }

  const styleMatches = program.styleTags.filter((style) => desiredStyles.includes(style.toLowerCase())).length;
  const stylePreference = Math.min(100, 38 + styleMatches * 22 + (desiredStyles.includes(program.mode) ? 10 : 0));
  const competitivenessFit =
    profile.selectivityComfort === "reach-heavy"
      ? program.competitiveness === "high"
        ? 100
        : program.competitiveness === "medium"
          ? 84
          : 66
      : profile.selectivityComfort === "balanced"
        ? program.competitiveness === "medium"
          ? 100
          : 82
        : program.competitiveness === "emerging"
          ? 100
          : 74;

  const modePreference = desiredStyles.includes("online")
    ? program.mode === "online"
      ? 100
      : 68
    : desiredStyles.includes("on-campus residential")
      ? program.mode === "in-person"
        ? 100
        : 80
      : 84;

  const targetCollegeRelevance = targetCollegeTerms.length
    ? Math.min(100, 48 + program.targetCollegeSignals.filter((signal) => targetCollegeTerms.some((target) => signal.toLowerCase().includes(target))).length * 20)
    : 70;

  const weaknessBoosts = weaknessTerms.filter((weakness) =>
    includesAny([...program.benefits, ...program.skillsGained, ...program.tags, ...program.styleTags], [weakness]),
  ).length;
  const scenarioBonus =
    scenario === "premed" && includesAny(program.subjectAreas, ["medicine", "biology", "public health"])
      ? 10
      : scenario === "policy" && includesAny(program.subjectAreas, ["public policy", "humanities"])
        ? 10
        : scenario === "business" && includesAny(program.subjectAreas, ["business", "entrepreneurship"])
          ? 10
          : 0;
  const growthOpportunity = Math.min(100, 44 + weaknessBoosts * 18 + schoolGapBoost + scenarioBonus);

  const minGpaPass = program.minGpa ? gpaMidpoint[profile.gpaRange] >= program.minGpa : true;
  const gpaAdjustment = minGpaPass ? 0 : -12;

  const overall = Math.round(
    majorAlignment * 0.2 +
      gradeEligibility * 0.1 +
      budgetCompatibility * 0.1 +
      locationPreference * 0.08 +
      stylePreference * 0.11 +
      competitivenessFit * 0.1 +
      modePreference * 0.05 +
      targetCollegeRelevance * 0.1 +
      growthOpportunity * 0.16 +
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
  const items: string[] = [];
  const scenario = getScenario(profile);
  if (program.styleTags.includes("research") && profile.weaknesses.some((item) => item.toLowerCase().includes("research"))) {
    items.push("adds research proof");
  }
  if (program.styleTags.includes("leadership") && profile.weaknesses.some((item) => item.toLowerCase().includes("leadership"))) {
    items.push("adds a clearer leadership signal");
  }
  if (scenario === "policy" && includesAny(program.subjectAreas, ["public policy", "humanities"])) {
    items.push("sharpens writing and civic work");
  }
  if (scenario === "premed" && includesAny(program.subjectAreas, ["medicine", "biology", "public health"])) {
    items.push("adds credible health exposure");
  }
  if (includesAny(program.subjectAreas, [profile.dreamMajor])) {
    items.push(`adds real depth in ${profile.dreamMajor.toLowerCase()}`);
  }
  if (program.targetCollegeSignals.some((school) => profile.dreamUniversities.includes(school))) {
    items.push("fits the current school list well");
  }
  if (!items.length) items.push("beats a generic enrichment option");
  return items.slice(0, 3);
}

function buildHighlights(score: ScoreBreakdown) {
  const highlights = [];
  if (score.majorAlignment >= 88) highlights.push("Strong major fit");
  if (score.budgetCompatibility >= 88) highlights.push("Budget works");
  if (score.growthOpportunity >= 84) highlights.push("Closes a real gap");
  if (score.targetCollegeRelevance >= 84) highlights.push("Good for this school list");
  if (!highlights.length) highlights.push("Balanced option");
  return highlights;
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
  const strongestAssets = [...profile.strengths.slice(0, 2), ...(profile.projectsAwardsCompetitions.length ? [profile.projectsAwardsCompetitions[0]] : [])].slice(0, 3);
  const biggestGaps = profile.weaknesses.slice(0, 3);
  const focusMap: Record<Scenario, string[]> = {
    cs: [
      "Back CS with real rigor, not just general STEM interest.",
      "Go deep in one build or research lane.",
      "Use summer to add proof the school year cannot.",
    ],
    engineering: [
      "Prioritize math, science, and build work.",
      "Show that you make, test, or fix things.",
      "Keep the story grounded in projects.",
    ],
    premed: [
      "Pair science rigor with service or health exposure.",
      "Avoid a profile that is all classes and no context.",
      "Let essays show maturity, not just good intentions.",
    ],
    business: [
      "Show initiative, not just interest.",
      "Pick roles with visible ownership.",
      "Use summer to launch, test, or lead something.",
    ],
    policy: [
      "Let writing and civic voice lead.",
      "Choose work that is public-facing or judgment-heavy.",
      "Keep the college list focused on fit, not just prestige.",
    ],
    humanities: [
      "Lean into reading, writing, and thoughtfulness.",
      "Depth beats generic well-roundedness.",
      "Pick summer options that add voice or research.",
    ],
    creative: [
      "Make work people can actually see.",
      "Choose output over broad participation.",
      "Let voice show up across the whole profile.",
    ],
    general: [
      "Choose fewer priorities.",
      "Build depth in one main lane.",
      "Use summer to fix a real gap.",
    ],
  };

  return {
    profileSnapshot: `${profile.gradeLevel}th grade, aiming at ${profile.dreamMajor}. Strongest sign so far: ${profile.strengths[0] || "clear upside"}. Biggest job now: make the profile feel sharper and more specific.`,
    strongestAssets: strongestAssets.length ? strongestAssets : ["Clear upside, but the best strengths still need to show up more clearly."],
    biggestGaps: biggestGaps.length ? biggestGaps : ["The profile needs clearer priorities and better differentiation."],
    whatMattersMost: focusMap[scenario],
    recommendedDirection: `Use the best school options first. Then add one summer move that closes the biggest gap. Do not try to optimize for everything at once.`,
  };
}

function buildSchoolOpportunityStrategy(profile: StudentProfile): SchoolOpportunityStrategy {
  const sortedCourses = profile.coursesAvailable.map((course) => coursePriority(profile, course)).sort((a, b) => ({ high: 3, medium: 2, low: 1 }[b.priority] - { high: 3, medium: 2, low: 1 }[a.priority]));
  const sortedActivities = profile.clubsAvailable.map((club) => activityPriority(profile, club)).sort((a, b) => ({ high: 3, medium: 2, low: 1 }[b.priority] - { high: 3, medium: 2, low: 1 }[a.priority]));
  const scenario = getScenario(profile);
  const leadershipFocusMap: Record<Scenario, string[]> = {
    cs: [
      `Lead where you can build, mentor, or ship something. Best lane: ${profile.leadershipOpportunities[0] || "a technical club"}.`,
      "A title without output is not enough here.",
    ],
    engineering: [
      `Pick a role tied to making or execution, like ${profile.leadershipOpportunities[0] || "a build-oriented activity"}.`,
      "Hands-on leadership beats admin-only titles.",
    ],
    premed: [
      `Look for leadership where service or health responsibility is visible, like ${profile.leadershipOpportunities[0] || "a science or service role"}.`,
      "The best version here looks dependable and people-facing.",
    ],
    business: [
      `Choose a role where you can organize, pitch, launch, or influence outcomes through ${profile.leadershipOpportunities[0] || "one execution-heavy lane"}.`,
      "Outcome-oriented leadership wins here.",
    ],
    policy: [
      `Pick leadership that makes speaking, writing, or organizing visible through ${profile.leadershipOpportunities[0] || "a public-facing role"}.`,
      "Voice and responsibility matter more than title count.",
    ],
    humanities: [
      "Look for editorial, discussion, or community-facing leadership.",
      "One strong lane beats scattered involvement.",
    ],
    creative: [
      "Lead where you can shape output, direct work, or present something publicly.",
      "The work matters more than the title.",
    ],
    general: [
      `Use ${profile.leadershipOpportunities[0] || "one meaningful role"} as the main leadership lane.`,
      "Depth and visible responsibility matter more than more titles.",
    ],
  };

  const lowValueAvailable = sortedActivities.filter((item) => item.priority === "low").slice(0, 2).map((item) => item.name);
  const deprioritize = lowValueAvailable.length
    ? lowValueAvailable.map((name) => `${name}: fine as a side activity. Not where most time should go.`)
    : ["Generic membership without output.", "Anything that pulls time from stronger priorities."];

  const gapClosure = [];
  if (profile.weaknesses.some((item) => item.toLowerCase().includes("research"))) {
    gapClosure.push(
      profile.localResearchAvailable
        ? "Ask teachers, local mentors, or nearby labs about a small research-style project."
        : "No local research access. Use summer options or a self-run question that leads to something concrete."
    );
  }
  if (profile.weaknesses.some((item) => item.toLowerCase().includes("leadership"))) {
    gapClosure.push(`Use ${profile.leadershipOpportunities[0] || "one school-based role"} to fix the leadership gap now.`);
  }
  if (profile.internshipsAvailable) {
    gapClosure.push("Only chase internships if they beat the best school options on fit.");
  } else {
    gapClosure.push("If internships are not realistic, lean harder on school opportunities and summer plans.");
  }
  if (!gapClosure.length) {
    gapClosure.push("Tie school rigor, one strong activity lane, and one summer move into a cleaner story.");
  }

  return {
    priorityCourses: sortedCourses,
    priorityActivities: sortedActivities,
    leadershipFocus: leadershipFocusMap[scenario],
    deprioritize,
    gapClosure,
  };
}

function buildTestingStrategy(profile: StudentProfile): TestingStrategy {
  const scenario = getScenario(profile);
  const eliteTargets = profile.dreamUniversities.filter((school) => COLLEGES.some((college) => college.name.toLowerCase() === school.toLowerCase() && college.selectivity === "ultra"));
  const testingSensitive = profile.dreamUniversities.some((school) =>
    COLLEGES.some((college) => college.name.toLowerCase() === school.toLowerCase() && (college.testing === "important" || college.testing === "helpful")),
  );
  const highGpa = gpaMidpoint[profile.gpaRange] >= 3.7;

  let recommendation = "";
  let whyItMatters = "";

  if (profile.testSituation === "SAT taken" || profile.testSituation === "ACT taken") {
    recommendation =
      profile.testingConfidence === "low"
        ? "Retest only if the current score is clearly holding this list back."
        : "Use the current score unless a retake has real upside.";
  } else if (testingSensitive && (eliteTargets.length > 0 || highGpa)) {
    recommendation = "Worth taking seriously. A strong score could help this list.";
  } else if (!testingSensitive && profile.testingConfidence === "low") {
    recommendation = "Test-optional is reasonable if the rest of the profile gets stronger.";
  } else {
    recommendation = "Take one real shot, then decide if scores are helping.";
  }

  const whyMap: Record<Scenario, string> = {
    cs: "For CS, a good score can back up quantitative readiness.",
    engineering: "For engineering, scores help most when math rigor is central to the story.",
    premed: "For pre-health goals, testing helps only if the science profile is already solid.",
    business: "Testing matters only if it adds clear analytical strength.",
    policy: "Do not let test prep crowd out writing or leadership work.",
    humanities: "Here, voice and writing usually matter more than scores.",
    creative: "For creative paths, scores are rarely the main differentiator.",
    general: "Scores help only if they clearly improve the overall case.",
  };
  whyItMatters = whyMap[scenario];

  const plan = [
    profile.testSituation === "no SAT/ACT yet" ? "Take one diagnostic and pick the better test." : "Check whether the current score is actually helping this list.",
    profile.testingConfidence === "low" ? "Use a short prep plan, not endless retakes." : "Tie prep to one or two real test dates.",
    eliteTargets.length > 0 ? "Be honest about whether extra prep time is worth it for the reach schools." : "If testing starts stealing time from better profile work, pull back.",
  ];

  const testOptionalView =
    testingSensitive && eliteTargets.length > 0
      ? "Test-optional is still possible, but the rest of the application needs to be sharp."
      : "Test-optional is fine here if classes, activities, and essays carry the case.";

  return { recommendation, whyItMatters, plan, testOptionalView };
}

function buildEssayStrategy(profile: StudentProfile): EssayStrategy {
  const scenario = getScenario(profile);
  const themes = [...profile.personalStatementThemes, ...profile.majorExperiences].slice(0, 5);
  const themeFallbacks: Record<Scenario, string[]> = {
    cs: ["building something useful for others", "moving from curiosity to disciplined problem-solving", "finding confidence through making"],
    engineering: ["learning by building and fixing", "turning frustration into design thinking", "being the person who likes solving tangible problems"],
    premed: ["witnessing care up close", "service that changed how responsibility feels", "learning empathy under pressure"],
    business: ["spotting problems and acting on them", "leading through execution", "learning how ideas become outcomes"],
    policy: ["finding a public voice", "advocacy shaped by lived experience", "leadership through writing or speaking"],
    humanities: ["intellectual curiosity that changed perspective", "voice shaped by reading or writing", "making meaning from complexity"],
    creative: ["creating work as a way of understanding identity", "storytelling as agency", "finding style through experimentation"],
    general: ["a turning point that clarified direction", "growth through responsibility", "voice shaped by a meaningful challenge"],
  };

  const narrativeDirectionsMap: Record<Scenario, string[]> = {
    cs: [
      "Start with one build, bug, or question that hooked you.",
      "Tie technical interest to usefulness, not just fascination.",
      "Show the jump from tinkering to ownership.",
    ],
    engineering: [
      "Anchor the story in building, testing, or fixing something.",
      "Show how you think through constraints.",
      "Connect hard classes to real problem-solving.",
    ],
    premed: [
      "Skip the generic 'I want to help people' essay.",
      "Focus on one moment that changed how you see care or responsibility.",
      "Let science and service connect naturally.",
    ],
    business: [
      "Build the story around initiative and ownership.",
      "Make leadership feel earned through execution.",
      "Use concrete choices, tradeoffs, and results.",
    ],
    policy: [
      "Lead with voice, judgment, or one public question that became personal.",
      "Use writing, speaking, or civic work to make it feel alive.",
      "Show thought, not just opinion.",
    ],
    humanities: [
      "Center the essay on one idea or tension that stayed with you.",
      "Use scenes and reflection, not a list of books or classes.",
      "Keep the voice precise and personal.",
    ],
    creative: [
      "Show how making work changed the way you see things.",
      "Let process and risk matter more than passion statements.",
      "Use detail so the voice shows up fast.",
    ],
    general: [
      "Choose a story that shows values and direction.",
      "Use scenes and decisions, not abstract traits.",
      "Make the essay connect to the rest of the application.",
    ],
  };

  const genericVsDistinctive = [
    "Avoid: broad essays about loving learning, leading, or helping people.",
    "Better: one story with a real decision, scene, or consequence.",
    `Best: an essay that points toward ${profile.dreamMajor.toLowerCase()} without reading like a resume.`,
  ];

  const nextSteps = [
    "Pick two angles and keep the one that feels least interchangeable.",
    "List moments, images, or decisions before drafting.",
    profile.essayWritingConfidence === "low" ? "Start with fragments and notes, not a polished draft." : "Draft fast, then cut anything generic.",
  ];

  return {
    promisingThemes: themes.length ? themes : themeFallbacks[scenario],
    narrativeDirections: narrativeDirectionsMap[scenario],
    genericVsDistinctive,
    nextSteps,
  };
}

function schoolFitReason(college: (typeof COLLEGES)[number], profile: StudentProfile) {
  const scenario = getScenario(profile);
  const phrases: Record<Scenario, string> = {
    cs: "a student building real technical depth",
    engineering: "an engineering path with rigor and hands-on work",
    premed: "a science-and-service profile",
    business: "a student growing initiative and analytical skill",
    policy: "a profile built around writing, voice, and civic work",
    humanities: "a student with strong intellectual voice",
    creative: "a path built on output and creative identity",
    general: "the current goals and profile",
  };
  return `Good fit for ${phrases[scenario]}. Strong on ${college.vibes.join(", ")}.`;
}

function collegeReason(college: (typeof COLLEGES)[number], bucket: "reach" | "target" | "safety", profile: StudentProfile): CollegeRecommendation {
  const base =
    bucket === "reach"
      ? "High bar, but the fit is real."
      : bucket === "target"
        ? "Realistic if the next year gets sharper."
        : "More attainable, still strong for this path.";
  return { name: college.name, reasoning: `${base} ${schoolFitReason(college, profile)}` };
}

function buildCollegeListStrategy(profile: StudentProfile): CollegeListStrategy {
  const scenario = getScenario(profile);
  const regionPref = profile.locationPreference === "no strong preference" ? null : profile.locationPreference;
  const ranked = COLLEGES
    .map((college) => {
      let score = 20;
      if (includesAny(college.majors, [profile.dreamMajor])) score += 30;
      if (profile.dreamUniversities.some((name) => name.toLowerCase() === college.name.toLowerCase())) score += 35;
      if (regionPref && college.region === regionPref) score += 10;
      if (scenario === "policy" && includesAny(college.vibes, ["writing", "leadership", "public service", "discussion"])) score += 12;
      if (scenario === "premed" && includesAny(college.vibes, ["research", "pre-health", "science", "service"])) score += 12;
      if (scenario === "business" && includesAny(college.vibes, ["initiative", "co-op", "career clarity", "applied learning"])) score += 12;
      if (scenario === "creative" && includesAny(college.vibes, ["portfolio", "voice", "output", "style"])) score += 12;
      return { college, score };
    })
    .sort((a, b) => b.score - a.score);

  function pick(bucket: "reach" | "target" | "safety", count: number) {
    return ranked.filter((item) => item.college.bucket === bucket).slice(0, count).map((item) => collegeReason(item.college, bucket, profile));
  }

  return {
    reach: pick("reach", 3),
    target: pick("target", 3),
    safety: pick("safety", 3),
  };
}

function buildActionPlan(profile: StudentProfile, school: SchoolOpportunityStrategy, matches: Omit<MatchResult, "ai">[]): ActionPlan {
  const scenario = getScenario(profile);
  const bestProgram = matches[0]?.program.name || "a strong-fit summer program";
  const topCourse = school.priorityCourses.find((course) => course.priority === "high")?.name || "your highest-rigor available coursework";
  const topActivity = school.priorityActivities.find((activity) => activity.priority === "high")?.name || "one high-signal activity";
  const scenarioSummer = {
    cs: "build or ship something visible",
    engineering: "design, prototype, or document a project",
    premed: "combine science with service or health exposure",
    business: "launch, lead, or test an initiative",
    policy: "write, speak, or organize around a public question",
    humanities: "produce thoughtful writing or research",
    creative: "finish and present actual creative work",
    general: "create one visible artifact that adds depth",
  }[scenario];

  return {
    thisSemester: [
      `Prioritize ${topCourse}.`,
      `Put more energy into ${topActivity}.`,
      `Pick one main gap to fix first: ${profile.weaknesses[0] || "clarity, depth, or direction"}.`,
    ],
    thisSummer: [
      `Pursue ${bestProgram} or a similar option.`,
      `Use the summer to ${scenarioSummer}.`,
      "Come out of summer with something concrete to show.",
    ],
    biggestFirstPriority: `Build a cleaner ${profile.dreamMajor.toLowerCase()} story through rigor, one focused activity lane, and one strong summer step.`,
    milestones: [
      "Course registration and rigor decisions",
      "Leadership applications or role-selection timelines",
      "Summer program and scholarship deadlines",
      profile.testSituation === "not planning yet" || profile.testSituation === "no SAT/ACT yet" ? "Testing decision checkpoint" : "Testing score/retest checkpoint",
    ],
    fallbackOptions: [
      "If cost blocks the first-choice program, pair a lower-cost option with a self-directed project.",
      "If selectivity blocks the top reach, double down on school rigor and visible ownership.",
      "If outside options fall through, use school and local options to make something concrete.",
    ],
  };
}

export function getMatches(profile: StudentProfile): Omit<MatchResult, "ai">[] {
  return PROGRAMS.map((program) => {
    const score = computeBreakdown(profile, program);
    return {
      program,
      score,
      reasoningHighlights: buildHighlights(score),
      strengthensProfile: summarizeStrengths(program, profile),
      impactAreas: createImpactAreas(profile, program),
    };
  }).sort((a, b) => b.score.overall - a.score.overall);
}

export function buildCounselorInsights(profile: StudentProfile, matches: Omit<MatchResult, "ai">[]): CounselorInsights {
  const schoolOpportunityStrategy = buildSchoolOpportunityStrategy(profile);
  return {
    strategicSummary: buildStrategicSummary(profile),
    schoolOpportunityStrategy,
    testingStrategy: buildTestingStrategy(profile),
    essayStrategy: buildEssayStrategy(profile),
    collegeListStrategy: buildCollegeListStrategy(profile),
    actionPlan: buildActionPlan(profile, schoolOpportunityStrategy, matches),
  };
}
