import { StudentProfile } from "@/types";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function labelize(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function scoreTone(score: number) {
  if (score >= 84) {
    return "text-ink bg-[#f3e7d9] border-[#d9c2ad]";
  }
  if (score >= 72) {
    return "text-brand-800 bg-brand-50 border-brand-200";
  }
  return "text-slate-700 bg-[#f8f1e8] border-line";
}

export function normalizeCsvList(values: string[]) {
  return values.map((value) => value.trim()).filter((value) => value.length > 0);
}

export function normalizeProfileForSubmit(profile: StudentProfile): StudentProfile {
  return {
    ...profile,
    dreamMajor: profile.dreamMajor.trim(),
    dreamUniversities: normalizeCsvList(profile.dreamUniversities),
    dreamPrograms: normalizeCsvList(profile.dreamPrograms),
    academicInterests: normalizeCsvList(profile.academicInterests),
    careerInterests: normalizeCsvList(profile.careerInterests),
    coursesAvailable: normalizeCsvList(profile.coursesAvailable),
    clubsAvailable: normalizeCsvList(profile.clubsAvailable),
    leadershipOpportunities: normalizeCsvList(profile.leadershipOpportunities),
    extracurriculars: normalizeCsvList(profile.extracurriculars),
    leadershipRoles: normalizeCsvList(profile.leadershipRoles),
    projectsAwardsCompetitions: normalizeCsvList(profile.projectsAwardsCompetitions),
    strengths: normalizeCsvList(profile.strengths),
    weaknesses: normalizeCsvList(profile.weaknesses),
    personalStatementThemes: normalizeCsvList(profile.personalStatementThemes),
    majorExperiences: normalizeCsvList(profile.majorExperiences),
  };
}
