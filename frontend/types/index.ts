export type GradeLevel = "9" | "10" | "11" | "12";
export type GpaRange = "3.9+" | "3.6-3.8" | "3.3-3.5" | "3.0-3.2" | "below 3.0";
export type BudgetComfort = "low" | "moderate" | "high" | "not a major concern";
export type FormatPreference = "in-person only" | "online only" | "either";
export type LocationComfort = "local / same state" | "same region" | "anywhere in US" | "international okay";
export type ResidentialPreference = "residential preferred" | "non-residential preferred" | "either";
export type DurationPreference = "1-2 weeks" | "3-4 weeks" | "5-6 weeks" | "flexible";
export type SelectivityComfort = "highly selective is fine" | "balanced" | "prefer realistic options";
export type ExperienceLevel = "beginner" | "some experience" | "advanced";

export interface StudentProfile {
  gradeLevel: GradeLevel;
  gpaRange: GpaRange;
  dreamMajor: string;
  academicInterests: string[];
  summerGoals: string[];
  courseworkBackground: string[];
  extracurriculars: string[];
  achievements: string[];
  academicStrengths: string[];
  priorExperienceLevel: ExperienceLevel;
  budgetComfort: BudgetComfort;
  formatPreference: FormatPreference;
  locationComfort: LocationComfort;
  homeState: string;
  residentialPreference: ResidentialPreference;
  durationPreference: DurationPreference;
  selectivityComfort: SelectivityComfort;
  programExcitement: string;
  avoidNotes: string;
}

export interface ProgramCsvRecord {
  program_id: string;
  program_name: string;
  institution: string;
  source_type: string;
  source_url: string;
  primary_field: string;
  secondary_fields: string;
  interests: string;
  goals: string;
  budget: string;
  format: string;
  location_preference: string;
  city: string;
  state_or_country: string;
  region: string;
  selectivity: string;
  duration: string;
  duration_weeks: string;
  season: string;
  grade_min: string;
  grade_max: string;
  support_type: string;
  tuition_usd: string;
  financial_aid: string;
  residential_option: string;
  description: string;
  keywords: string;
  academic_strength_target: string;
  recommended_gpa_range: string;
  coursework_background_expected: string;
  prior_experience_expected: string;
  academic_rigor_level: string;
  prerequisite_notes: string;
}

export interface PreCollegeProgram {
  id: string;
  name: string;
  institution: string;
  sourceType: string;
  sourceUrl: string;
  primaryField: string;
  secondaryFields: string[];
  interests: string[];
  goals: string[];
  budget: string;
  format: string;
  locationPreference: string;
  city: string;
  stateOrCountry: string;
  region: string;
  selectivity: string;
  duration: string;
  durationWeeks: number | null;
  season: string;
  gradeMin: number | null;
  gradeMax: number | null;
  supportType: string;
  tuitionUsd: number | null;
  financialAid: string;
  residentialOption: string;
  description: string;
  keywords: string[];
  academicStrengthTarget: string;
  recommendedGpaRange: string;
  courseworkBackgroundExpected: string;
  priorExperienceExpected: string;
  academicRigorLevel: string;
  prerequisiteNotes: string;
}

export interface ScoreBreakdown {
  interestAlignment: number;
  goalAlignment: number;
  academicFit: number;
  budgetFit: number;
  formatFit: number;
  locationFit: number;
  durationFit: number;
  residentialFit: number;
  selectivityFit: number;
  total: number;
}

export interface ProgramRecommendation {
  program: PreCollegeProgram;
  fitScore: number;
  scoreBreakdown: ScoreBreakdown;
  whyItFits: string[];
  matchedOn: string[];
  bestFor: string;
  caution: string;
}

export interface MatchResponse {
  profile: StudentProfile;
  topMatch: ProgramRecommendation | null;
  backupMatches: ProgramRecommendation[];
  compareMatches: ProgramRecommendation[];
  consideredCount: number;
  eligibleCount: number;
  generatedAt: string;
}
