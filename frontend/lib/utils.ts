import { StudentProfile } from "@/types";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function scoreTone(score: number) {
  if (score >= 88) {
    return "border-[#d7be9e] bg-[#f2e5d6] text-ink";
  }
  if (score >= 76) {
    return "border-[#e4d4c2] bg-[#f7efe6] text-ink";
  }
  return "border-line bg-[#faf3eb] text-slate-700";
}

export function normalizeCsvList(values: string[]) {
  return values.map((value) => value.trim()).filter((value) => value.length > 0);
}

export function normalizeProfileForSubmit(profile: StudentProfile): StudentProfile {
  return {
    ...profile,
    dreamMajor: profile.dreamMajor.trim(),
    academicInterests: normalizeCsvList(profile.academicInterests),
    summerGoals: normalizeCsvList(profile.summerGoals),
    courseworkBackground: normalizeCsvList(profile.courseworkBackground),
    extracurriculars: normalizeCsvList(profile.extracurriculars),
    achievements: normalizeCsvList(profile.achievements),
    academicStrengths: normalizeCsvList(profile.academicStrengths),
    homeState: profile.homeState.trim(),
    programExcitement: profile.programExcitement.trim(),
    avoidNotes: profile.avoidNotes.trim(),
  };
}
