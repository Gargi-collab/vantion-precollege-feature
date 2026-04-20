import {
  DurationPreference,
  FormatPreference,
  PreCollegeProgram,
  ResidentialPreference,
  ScoreBreakdown,
  SelectivityComfort,
  StudentProfile,
} from "@/types";

const gpaMidpoints = {
  "3.9+": 3.95,
  "3.6-3.8": 3.7,
  "3.3-3.5": 3.4,
  "3.0-3.2": 3.1,
  "below 3.0": 2.8,
} as const;

const trackVocabulary: Array<{ id: string; test: RegExp; terms: string[] }> = [
  {
    id: "cs",
    test: /(computer science|software|coding|programming|ai|artificial intelligence|data science|machine learning)/,
    terms: ["computer science", "software engineering", "artificial intelligence", "data science", "coding", "programming"],
  },
  {
    id: "premed",
    test: /(medicine|biology|health|public health|pre-med|neuroscience|biomedical)/,
    terms: ["medicine", "biology", "public health", "health", "clinical", "biomedical engineering"],
  },
  {
    id: "business",
    test: /(business|entrepreneur|marketing|economics|finance|product)/,
    terms: ["business", "entrepreneurship", "leadership", "economics", "marketing", "product design"],
  },
  {
    id: "humanities",
    test: /(policy|history|government|humanities|writing|journalism|international relations|law)/,
    terms: ["public policy", "writing", "humanities", "history", "government", "international relations", "media"],
  },
  {
    id: "engineering",
    test: /(engineering|robotics|mechanical|electrical|aerospace|design)/,
    terms: ["engineering", "robotics", "design", "prototype", "cad"],
  },
];

const goalSignals: Record<string, string[]> = {
  "research exposure": ["research", "faculty mentored", "lab", "poster", "literature review", "mentor"],
  "hands-on projects": ["hands-on", "project", "build", "prototype", "capstone", "design challenge"],
  "leadership": ["leadership", "mentor", "pitch", "team leadership", "cohort"],
  "career exploration": ["career exploration", "simulation", "startup", "clinical", "industry", "community impact"],
  "portfolio building": ["portfolio", "showcase", "public", "open source", "product demo", "writing portfolio"],
  "academic challenge": ["academic challenge", "rigorous", "seminar", "proof", "quant", "selective"],
};

const stateToRegion: Record<string, string> = {
  arizona: "west coast",
  california: "west coast",
  washington: "west coast",
  oregon: "west coast",
  georgia: "south",
  texas: "south",
  florida: "south",
  massachusetts: "east coast",
  "new york": "east coast",
  pennsylvania: "east coast",
  "rhode island": "east coast",
  virginia: "east coast",
  "district of columbia": "east coast",
  "washington d.c.": "east coast",
  illinois: "midwest",
  ohio: "midwest",
  missouri: "midwest",
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function splitText(value: string) {
  return normalize(value)
    .split(/[^a-z0-9.+#-]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function includesPhrase(text: string, phrase: string) {
  const normalizedPhrase = normalize(phrase);
  return normalizedPhrase.length > 0 && text.includes(normalizedPhrase);
}

function parseRecommendedGpa(value: string) {
  const normalized = normalize(value);
  if (!normalized) return { min: null as number | null, max: null as number | null };
  if (normalized.endsWith("+")) {
    return { min: Number(normalized.replace("+", "")), max: null };
  }
  const [min, max] = normalized.split("-").map(Number);
  if (Number.isFinite(min) && Number.isFinite(max)) {
    return { min, max };
  }
  return { min: null, max: null };
}

function buildProfileTerms(profile: StudentProfile) {
  const raw = unique([
    profile.dreamMajor,
    ...profile.academicInterests,
    ...profile.courseworkBackground,
    profile.programExcitement,
  ]);

  const expanded = [...raw];
  const joined = raw.join(" ").toLowerCase();
  for (const track of trackVocabulary) {
    if (track.test.test(joined)) {
      expanded.push(...track.terms);
    }
  }

  return unique(expanded);
}

function inferProfileTrack(profile: StudentProfile) {
  const joined = [profile.dreamMajor, ...profile.academicInterests, profile.programExcitement].join(" ").toLowerCase();
  return trackVocabulary.find((track) => track.test.test(joined))?.id ?? null;
}

function inferProgramTracks(program: PreCollegeProgram) {
  const joined = [program.primaryField, ...program.secondaryFields, ...program.keywords].join(" ").toLowerCase();
  return trackVocabulary.filter((track) => track.test.test(joined)).map((track) => track.id);
}

function buildProgramText(program: PreCollegeProgram) {
  return normalize(
    [
      program.primaryField,
      ...program.secondaryFields,
      ...program.interests,
      ...program.goals,
      ...program.keywords,
      program.description,
      program.supportType,
      program.courseworkBackgroundExpected,
      program.priorExperienceExpected,
      program.prerequisiteNotes,
    ].join(" "),
  );
}

function interestAlignment(profile: StudentProfile, program: PreCollegeProgram) {
  const profileTerms = buildProfileTerms(profile);
  const programText = buildProgramText(program);
  const profileTrack = inferProfileTrack(profile);
  const programTracks = inferProgramTracks(program);
  let score = 0;
  let directHits = 0;

  for (const term of profileTerms) {
    if (includesPhrase(programText, term)) {
      directHits += 1;
      score += term === profile.dreamMajor ? 9 : term.length > 10 ? 5 : 3;
    }
  }

  if (includesPhrase(programText, program.primaryField)) {
    score += 3;
  }

  if (directHits === 0 && profile.dreamMajor) {
    const majorWords = splitText(profile.dreamMajor);
    if (majorWords.some((word) => includesPhrase(programText, word))) {
      score += 6;
    }
  }

  if (profileTrack && programTracks.length > 0 && !programTracks.includes(profileTrack)) {
    score -= 6;
  }

  return Math.max(0, Math.min(score, 30));
}

function goalAlignment(profile: StudentProfile, program: PreCollegeProgram) {
  const goalTerms = unique([...profile.summerGoals, profile.programExcitement]);
  const searchableText = normalize([program.supportType, ...program.goals, ...program.keywords, program.description].join(" "));
  let score = 0;

  for (const goal of goalTerms) {
    if (!goal) continue;

    if (includesPhrase(searchableText, goal)) {
      score += 8;
      continue;
    }

    const signals = goalSignals[normalize(goal)] ?? splitText(goal);
    const hits = signals.filter((signal) => includesPhrase(searchableText, signal)).length;
    score += Math.min(hits * 3, 8);
  }

  return Math.min(score, 20);
}

function academicFit(profile: StudentProfile, program: PreCollegeProgram) {
  const studentGpa = gpaMidpoints[profile.gpaRange];
  const recommended = parseRecommendedGpa(program.recommendedGpaRange);
  let score = 5;

  if (recommended.min !== null) {
    if (studentGpa >= recommended.min + 0.15) score += 5;
    else if (studentGpa >= recommended.min) score += 4;
    else if (studentGpa >= recommended.min - 0.2) score += 2;
    else score -= 2;
  } else {
    score += 2;
  }

  if (program.academicRigorLevel === "high") {
    score += studentGpa >= 3.6 ? 3 : 1;
  } else if (program.academicRigorLevel === "moderate") {
    score += 2;
  } else {
    score += 1;
  }

  const backgroundText = normalize([...profile.courseworkBackground, ...profile.achievements].join(" "));
  if (program.courseworkBackgroundExpected.includes("coding") && /(computer|coding|programming|statistics|calculus)/.test(backgroundText)) score += 2;
  if (program.courseworkBackgroundExpected.includes("biology") && /(biology|chemistry|anatomy)/.test(backgroundText)) score += 2;
  if (program.courseworkBackgroundExpected.includes("reading and writing") && /(english|history|debate|writing|newspaper)/.test(backgroundText)) score += 2;
  if (program.courseworkBackgroundExpected.includes("leadership") && /(deca|student government|captain|lead|editor)/.test(backgroundText)) score += 2;

  if (profile.priorExperienceLevel === "advanced" && program.priorExperienceExpected.includes("some prior")) score += 2;
  if (profile.priorExperienceLevel === "some experience" && /some prior|basic familiarity/.test(program.priorExperienceExpected)) score += 2;
  if (profile.priorExperienceLevel === "beginner" && program.priorExperienceExpected.includes("open to beginners")) score += 3;

  return Math.max(0, Math.min(score, 16));
}

function budgetFit(profile: StudentProfile, program: PreCollegeProgram) {
  if (profile.budgetComfort === "not a major concern") return 10;

  const tuition = program.tuitionUsd ?? 0;
  const hasAid = program.financialAid === "yes";
  const budgetLevel = program.budget;

  if (profile.budgetComfort === "low") {
    if (tuition <= 1000 || budgetLevel === "low") return 10;
    if (hasAid && tuition <= 3000) return 7;
    if (tuition <= 2500) return 6;
    if (tuition <= 4500) return 3;
    return 1;
  }

  if (profile.budgetComfort === "moderate") {
    if (tuition <= 2500 || budgetLevel === "low") return 10;
    if (tuition <= 4500 || budgetLevel === "moderate") return 8;
    if (hasAid) return 6;
    return 3;
  }

  if (tuition <= 7000) return 9;
  return hasAid ? 8 : 7;
}

function formatFit(preference: FormatPreference, format: string) {
  if (preference === "either") return format === "hybrid" ? 8 : 7;
  if (preference === "online only") return format === "online" ? 8 : 0;
  return format === "in-person" || format === "hybrid" ? 8 : 0;
}

function getHomeRegion(homeState: string) {
  return stateToRegion[normalize(homeState)] ?? "";
}

function isUsLocation(program: PreCollegeProgram) {
  return program.stateOrCountry === "Online" || program.stateOrCountry.length > 0;
}

function locationFit(profile: StudentProfile, program: PreCollegeProgram) {
  if (program.format === "online") {
    return profile.formatPreference === "online only" ? 8 : 6;
  }

  const homeState = normalize(profile.homeState);
  const homeRegion = getHomeRegion(profile.homeState);
  const programState = normalize(program.stateOrCountry);
  const sameState = homeState.length > 0 && homeState === programState;
  const sameRegion = homeRegion.length > 0 && homeRegion === normalize(program.region);

  switch (profile.locationComfort) {
    case "local / same state":
      if (sameState) return 8;
      if (sameRegion) return 4;
      return 1;
    case "same region":
      if (sameState) return 8;
      if (sameRegion) return 7;
      return 2;
    case "anywhere in US":
      return isUsLocation(program) ? 8 : 4;
    case "international okay":
      return 8;
    default:
      return 4;
  }
}

function durationRange(preference: DurationPreference) {
  switch (preference) {
    case "1-2 weeks":
      return { min: 1, max: 2 };
    case "3-4 weeks":
      return { min: 3, max: 4 };
    case "5-6 weeks":
      return { min: 5, max: 6 };
    default:
      return { min: 0, max: 20 };
  }
}

function durationFit(preference: DurationPreference, durationWeeks: number | null) {
  if (preference === "flexible" || durationWeeks === null) return 4;
  const range = durationRange(preference);
  if (durationWeeks >= range.min && durationWeeks <= range.max) return 4;
  if (Math.abs(durationWeeks - range.max) <= 1 || Math.abs(durationWeeks - range.min) <= 1) return 2;
  return 0;
}

function residentialFit(preference: ResidentialPreference, option: string) {
  if (preference === "either") return 2;
  if (preference === "residential preferred") {
    if (option === "available") return 3;
    if (option === "possible") return 2;
    return 0;
  }

  if (option === "not offered") return 3;
  if (option === "possible") return 2;
  return 1;
}

function selectivityFit(comfort: SelectivityComfort, selectivity: string) {
  if (comfort === "highly selective is fine") {
    if (selectivity === "high") return 4;
    if (selectivity === "medium") return 3;
    return 2;
  }

  if (comfort === "balanced") {
    if (selectivity === "medium") return 4;
    if (selectivity === "high") return 3;
    return 3;
  }

  if (selectivity === "emerging") return 4;
  if (selectivity === "medium") return 3;
  return 1;
}

function isGradeEligible(profile: StudentProfile, program: PreCollegeProgram) {
  const grade = Number(profile.gradeLevel);
  if (program.gradeMin !== null && grade < program.gradeMin) return false;
  if (program.gradeMax !== null && grade > program.gradeMax) return false;
  return true;
}

export interface ScoredProgram {
  program: PreCollegeProgram;
  scoreBreakdown: ScoreBreakdown;
  fitScore: number;
}

export function scoreProgram(profile: StudentProfile, program: PreCollegeProgram): ScoredProgram {
  const scoreBreakdown: ScoreBreakdown = {
    interestAlignment: interestAlignment(profile, program),
    goalAlignment: goalAlignment(profile, program),
    academicFit: academicFit(profile, program),
    budgetFit: budgetFit(profile, program),
    formatFit: formatFit(profile.formatPreference, program.format),
    locationFit: locationFit(profile, program),
    durationFit: durationFit(profile.durationPreference, program.durationWeeks),
    residentialFit: residentialFit(profile.residentialPreference, program.residentialOption),
    selectivityFit: selectivityFit(profile.selectivityComfort, program.selectivity),
    total: 0,
  };

  scoreBreakdown.total =
    scoreBreakdown.interestAlignment +
    scoreBreakdown.goalAlignment +
    scoreBreakdown.academicFit +
    scoreBreakdown.budgetFit +
    scoreBreakdown.formatFit +
    scoreBreakdown.locationFit +
    scoreBreakdown.durationFit +
    scoreBreakdown.residentialFit +
    scoreBreakdown.selectivityFit;

  return {
    program,
    scoreBreakdown,
    fitScore: scoreBreakdown.total,
  };
}

export function filterAndScorePrograms(profile: StudentProfile, programs: PreCollegeProgram[]) {
  const gradeEligible = programs.filter((program) => isGradeEligible(profile, program));
  const formatEligible = gradeEligible.filter((program) => formatFit(profile.formatPreference, program.format) > 0);
  const scored = formatEligible.map((program) => scoreProgram(profile, program));

  const strongEnough = scored.filter(
    (item) => item.scoreBreakdown.interestAlignment >= 8 && item.scoreBreakdown.total >= 38,
  );

  const rankedPool = (strongEnough.length >= 4 ? strongEnough : scored)
    .filter((item) => item.scoreBreakdown.interestAlignment >= 6)
    .sort((left, right) => right.fitScore - left.fitScore);

  return {
    consideredCount: programs.length,
    eligibleCount: formatEligible.length,
    rankedPrograms: rankedPool,
  };
}
