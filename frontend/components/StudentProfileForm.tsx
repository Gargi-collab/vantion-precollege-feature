"use client";

import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { AccordionItem } from "@/components/AccordionItem";
import { formOptions } from "@/lib/constants";
import { StudentProfile } from "@/types";

interface StudentProfileFormProps {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  onSubmit: () => void;
  loading: boolean;
  syncKey?: number;
}

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const csvFields = ["academicInterests", "summerGoals", "courseworkBackground", "extracurriculars", "achievements", "academicStrengths"] as const;
type CsvField = (typeof csvFields)[number];

function buildCsvDrafts(profile: StudentProfile): Record<CsvField, string> {
  return {
    academicInterests: profile.academicInterests.join(", "),
    summerGoals: profile.summerGoals.join(", "),
    courseworkBackground: profile.courseworkBackground.join(", "),
    extracurriculars: profile.extracurriculars.join(", "),
    achievements: profile.achievements.join(", "),
    academicStrengths: profile.academicStrengths.join(", "),
  };
}

function FieldShell({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-800">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

function countLabel(count: number, singular: string, plural = `${singular}s`) {
  if (count === 0) return `No ${plural} yet`;
  if (count === 1) return `1 ${singular}`;
  return `${count} ${plural}`;
}

export function StudentProfileForm({ profile, onChange, onSubmit, loading, syncKey = 0 }: StudentProfileFormProps) {
  const [csvDrafts, setCsvDrafts] = useState<Record<CsvField, string>>(() => buildCsvDrafts(profile));

  useEffect(() => {
    setCsvDrafts(buildCsvDrafts(profile));
  }, [syncKey]);

  const updateField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    onChange({ ...profile, [field]: value });
  };

  const inputClassName =
    "w-full rounded-[22px] border border-line bg-[#fffdfa] px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100/50";
  const textAreaClassName = `${inputClassName} min-h-[110px] resize-y`;

  const handleCsvField =
    (field: CsvField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const rawValue = event.target.value;
      setCsvDrafts((current) => ({ ...current, [field]: rawValue }));
      updateField(field, parseCsv(rawValue));
    };

  const goalsPreview = [
    profile.dreamMajor || "No major yet",
    `${profile.gradeLevel}th grade`,
    profile.gpaRange,
    countLabel(profile.summerGoals.length, "goal"),
  ].join(" • ");

  const backgroundPreview = [
    countLabel(profile.courseworkBackground.length, "course"),
    countLabel(profile.extracurriculars.length, "activity"),
    countLabel(profile.achievements.length, "achievement"),
  ].join(" • ");

  const preferencesPreview = [profile.budgetComfort, profile.formatPreference, profile.locationComfort].join(" • ");
  const optionalPreview = profile.programExcitement ? "Extra notes added" : "No extra notes";

  return (
    <section id="intake" className="section-shell mt-10 sm:mt-12">
      <div className="glass-card bg-panel p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-3 border-b border-line pb-6">
          <p className="soft-label">Student Input</p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">Tell us enough to make the match real</h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            Keep it brief. We only ask for details that change the recommendation.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <AccordionItem title="Goals" preview={goalsPreview} defaultOpen>
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="Grade level">
                <select
                  className={inputClassName}
                  value={profile.gradeLevel}
                  onChange={(event) => updateField("gradeLevel", event.target.value as StudentProfile["gradeLevel"])}
                >
                  {formOptions.gradeLevels.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}th grade
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="GPA range">
                <select
                  className={inputClassName}
                  value={profile.gpaRange}
                  onChange={(event) => updateField("gpaRange", event.target.value as StudentProfile["gpaRange"])}
                >
                  {formOptions.gpaRanges.map((gpa) => (
                    <option key={gpa} value={gpa}>
                      {gpa}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Intended area of interest / major">
                <input
                  className={inputClassName}
                  value={profile.dreamMajor}
                  onChange={(event) => updateField("dreamMajor", event.target.value)}
                  placeholder="Computer Science"
                />
              </FieldShell>

              <FieldShell label="Academic interests" hint="Comma-separated">
                <input
                  className={inputClassName}
                  value={csvDrafts.academicInterests}
                  onChange={handleCsvField("academicInterests")}
                  placeholder="AI, robotics, machine learning"
                />
              </FieldShell>

              <FieldShell label="Goals for the summer" hint="Comma-separated">
                <input
                  className={inputClassName}
                  value={csvDrafts.summerGoals}
                  onChange={handleCsvField("summerGoals")}
                  placeholder="research exposure, hands-on projects, leadership"
                />
              </FieldShell>
            </div>
          </AccordionItem>

          <AccordionItem title="Background" preview={backgroundPreview}>
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="Coursework background" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.courseworkBackground}
                  onChange={handleCsvField("courseworkBackground")}
                  placeholder="AP Computer Science A, AP Calculus AB, Honors Biology"
                />
              </FieldShell>

              <FieldShell label="Extracurriculars" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.extracurriculars}
                  onChange={handleCsvField("extracurriculars")}
                  placeholder="Coding Club, HOSA, Debate, hospital volunteering"
                />
              </FieldShell>

              <FieldShell label="Projects / awards / achievements" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.achievements}
                  onChange={handleCsvField("achievements")}
                  placeholder="built a study app, state speech finalist, DECA district finalist"
                />
              </FieldShell>

              <FieldShell label="Academic strengths" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.academicStrengths}
                  onChange={handleCsvField("academicStrengths")}
                  placeholder="math, close reading, coding, lab work"
                />
              </FieldShell>

              <FieldShell label="Prior experience level">
                <select
                  className={inputClassName}
                  value={profile.priorExperienceLevel}
                  onChange={(event) => updateField("priorExperienceLevel", event.target.value as StudentProfile["priorExperienceLevel"])}
                >
                  {formOptions.priorExperienceLevel.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </FieldShell>
            </div>
          </AccordionItem>

          <AccordionItem title="Preferences & constraints" preview={preferencesPreview}>
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="Budget comfort">
                <select
                  className={inputClassName}
                  value={profile.budgetComfort}
                  onChange={(event) => updateField("budgetComfort", event.target.value as StudentProfile["budgetComfort"])}
                >
                  {formOptions.budgetComfort.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Format preference">
                <select
                  className={inputClassName}
                  value={profile.formatPreference}
                  onChange={(event) => updateField("formatPreference", event.target.value as StudentProfile["formatPreference"])}
                >
                  {formOptions.formatPreference.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Location comfort">
                <select
                  className={inputClassName}
                  value={profile.locationComfort}
                  onChange={(event) => updateField("locationComfort", event.target.value as StudentProfile["locationComfort"])}
                >
                  {formOptions.locationComfort.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Home state" hint="Used for same-state or same-region matching">
                <input
                  className={inputClassName}
                  value={profile.homeState}
                  onChange={(event) => updateField("homeState", event.target.value)}
                  placeholder="Arizona"
                />
              </FieldShell>

              <FieldShell label="Residential preference">
                <select
                  className={inputClassName}
                  value={profile.residentialPreference}
                  onChange={(event) => updateField("residentialPreference", event.target.value as StudentProfile["residentialPreference"])}
                >
                  {formOptions.residentialPreference.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Duration preference">
                <select
                  className={inputClassName}
                  value={profile.durationPreference}
                  onChange={(event) => updateField("durationPreference", event.target.value as StudentProfile["durationPreference"])}
                >
                  {formOptions.durationPreference.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Selectivity comfort">
                <select
                  className={inputClassName}
                  value={profile.selectivityComfort}
                  onChange={(event) => updateField("selectivityComfort", event.target.value as StudentProfile["selectivityComfort"])}
                >
                  {formOptions.selectivityComfort.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FieldShell>
            </div>
          </AccordionItem>

          <AccordionItem title="Optional notes" preview={optionalPreview}>
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="What kind of program sounds exciting?">
                <textarea
                  className={textAreaClassName}
                  value={profile.programExcitement}
                  onChange={(event) => updateField("programExcitement", event.target.value)}
                  placeholder="Research-heavy. Project-based. Small cohort. Strong mentors."
                />
              </FieldShell>

              <FieldShell label="Anything you want to avoid?">
                <textarea
                  className={textAreaClassName}
                  value={profile.avoidNotes}
                  onChange={(event) => updateField("avoidNotes", event.target.value)}
                  placeholder="Too lecture-heavy. Too expensive. Too far from home."
                />
              </FieldShell>
            </div>
          </AccordionItem>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">We’ll use this to rank the current program catalog and show only the best-fit options.</p>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Matching programs..." : "See my best-fit programs"}
          </button>
        </div>
      </div>
    </section>
  );
}
