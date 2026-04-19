export type GradeLevel = "9" | "10" | "11" | "12";

export type BudgetLevel = "low" | "moderate" | "high" | "flexible";
export type LocationPreference = "west coast" | "east coast" | "south" | "midwest" | "online only" | "no strong preference";
export type SelectivityComfort = "reach-heavy" | "balanced" | "accessible";
export type Availability = "2-4 weeks" | "4-6 weeks" | "6-8 weeks" | "flexible";
export type ProgramMode = "online" | "in-person" | "hybrid";
export type ProgramStyle =
  | "research"
  | "academic enrichment"
  | "leadership"
  | "internship-like"
  | "creative"
  | "online"
  | "on-campus residential";

export type TestSituation = "no SAT/ACT yet" | "SAT taken" | "ACT taken" | "not planning yet";
export type ConfidenceLevel = "low" | "medium" | "high";
export type CounselingSupport = "strong" | "moderate" | "limited";
export type PriorityLevel = "high" | "medium" | "low";

export interface StudentProfile {
  dreamMajor: string;
  dreamUniversities: string[];
  dreamPrograms: string[];
  academicInterests: string[];
  careerInterests: string[];
  gradeLevel: GradeLevel;
  gpaRange: string;
  budgetLevel: BudgetLevel;
  locationPreference: LocationPreference;
  summerAvailability: Availability;
  selectivityComfort: SelectivityComfort;
  desiredStyles: ProgramStyle[];
  coursesAvailable: string[];
  clubsAvailable: string[];
  leadershipOpportunities: string[];
  localResearchAvailable: boolean;
  internshipsAvailable: boolean;
  volunteeringShadowingAvailable: boolean;
  counselingSupport: CounselingSupport;
  extracurriculars: string[];
  leadershipRoles: string[];
  projectsAwardsCompetitions: string[];
  strengths: string[];
  weaknesses: string[];
  testSituation: TestSituation;
  testingConfidence: ConfidenceLevel;
  personalStatementThemes: string[];
  majorExperiences: string[];
  essayWritingConfidence: ConfidenceLevel;
}

export interface PreCollegeProgram {
  id: string;
  name: string;
  provider: string;
  subjectAreas: string[];
  description: string;
  location: string;
  region: "west coast" | "east coast" | "south" | "midwest" | "national" | "online";
  mode: ProgramMode;
  duration: string;
  durationCategory: Availability;
  costRange: string;
  costBucket: BudgetLevel;
  deadline: string;
  gradeEligibility: GradeLevel[];
  minGpa?: number;
  competitiveness: "high" | "medium" | "emerging";
  styleTags: ProgramStyle[];
  tags: string[];
  benefits: string[];
  drawbacks: string[];
  bestFitStudentProfiles: string[];
  skillsGained: string[];
  collegeApplicationValue: string;
  idealStudentType: string;
  targetCollegeSignals: string[];
}

export interface ScoreBreakdown {
  overall: number;
  majorAlignment: number;
  gradeEligibility: number;
  budgetCompatibility: number;
  locationPreference: number;
  stylePreference: number;
  competitivenessFit: number;
  modePreference: number;
  targetCollegeRelevance: number;
  growthOpportunity: number;
}

export interface ImpactArea {
  area: "academic rigor" | "demonstrated interest" | "extracurricular depth" | "leadership" | "major alignment";
  before: number;
  after: number;
}

export interface AiInsights {
  matchExplanation: string;
  gapAnalysis: string;
  impactSummary: string;
  nextActions: string[];
  drawbacks: string[];
  alternatives: string[];
}

export interface MatchResult {
  program: PreCollegeProgram;
  score: ScoreBreakdown;
  reasoningHighlights: string[];
  strengthensProfile: string[];
  impactAreas: ImpactArea[];
  ai: AiInsights;
}

export interface StrategicSummary {
  profileSnapshot: string;
  strongestAssets: string[];
  biggestGaps: string[];
  whatMattersMost: string[];
  recommendedDirection: string;
}

export interface PrioritizedOpportunity {
  name: string;
  priority: PriorityLevel;
  rationale: string;
}

export interface SchoolOpportunityStrategy {
  priorityCourses: PrioritizedOpportunity[];
  priorityActivities: PrioritizedOpportunity[];
  leadershipFocus: string[];
  deprioritize: string[];
  gapClosure: string[];
}

export interface TestingStrategy {
  recommendation: string;
  whyItMatters: string;
  plan: string[];
  testOptionalView: string;
}

export interface EssayStrategy {
  promisingThemes: string[];
  narrativeDirections: string[];
  genericVsDistinctive: string[];
  nextSteps: string[];
}

export interface CollegeRecommendation {
  name: string;
  reasoning: string;
}

export interface CollegeListStrategy {
  reach: CollegeRecommendation[];
  target: CollegeRecommendation[];
  safety: CollegeRecommendation[];
}

export interface ActionPlan {
  thisSemester: string[];
  thisSummer: string[];
  biggestFirstPriority: string;
  milestones: string[];
  fallbackOptions: string[];
}

export interface CounselorInsights {
  strategicSummary: StrategicSummary;
  schoolOpportunityStrategy: SchoolOpportunityStrategy;
  testingStrategy: TestingStrategy;
  essayStrategy: EssayStrategy;
  collegeListStrategy: CollegeListStrategy;
  actionPlan: ActionPlan;
}

export interface MatchResponse {
  profile: StudentProfile;
  insights: CounselorInsights;
  matches: MatchResult[];
  topThreeIds: string[];
  counselorSummary: string;
  generatedAt: string;
}
