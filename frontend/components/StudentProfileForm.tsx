"use client";

import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { AccordionItem } from "@/components/AccordionItem";
import { formOptions } from "@/lib/constants";
import { cn, labelize } from "@/lib/utils";
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

const csvFields = [
  "dreamUniversities",
  "dreamPrograms",
  "academicInterests",
  "careerInterests",
  "coursesAvailable",
  "clubsAvailable",
  "leadershipOpportunities",
  "extracurriculars",
  "leadershipRoles",
  "projectsAwardsCompetitions",
  "strengths",
  "weaknesses",
  "personalStatementThemes",
  "majorExperiences",
] as const;

type CsvField = (typeof csvFields)[number];

function buildCsvDrafts(profile: StudentProfile): Record<CsvField, string> {
  return {
    dreamUniversities: profile.dreamUniversities.join(", "),
    dreamPrograms: profile.dreamPrograms.join(", "),
    academicInterests: profile.academicInterests.join(", "),
    careerInterests: profile.careerInterests.join(", "),
    coursesAvailable: profile.coursesAvailable.join(", "),
    clubsAvailable: profile.clubsAvailable.join(", "),
    leadershipOpportunities: profile.leadershipOpportunities.join(", "),
    extracurriculars: profile.extracurriculars.join(", "),
    leadershipRoles: profile.leadershipRoles.join(", "),
    projectsAwardsCompetitions: profile.projectsAwardsCompetitions.join(", "),
    strengths: profile.strengths.join(", "),
    weaknesses: profile.weaknesses.join(", "),
    personalStatementThemes: profile.personalStatementThemes.join(", "),
    majorExperiences: profile.majorExperiences.join(", "),
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

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="rounded-[22px] border border-line bg-[#fffdfa] p-4">
      <p className="text-sm font-medium text-ink">{label}</p>
      <div className="mt-3 flex gap-2">
        {[true, false].map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              value === option ? "border-[#d5b89e] bg-[#f1dfcf] text-ink" : "border-line bg-[#fff8f2] text-slate-600 hover:bg-[#fbf1e6]",
            )}
          >
            {option ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
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
  const textAreaClassName = `${inputClassName} min-h-[108px] resize-y`;

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
    countLabel(profile.dreamUniversities.length, "school"),
  ].join(" • ");

  const schoolPreview = [
    countLabel(profile.coursesAvailable.length, "course"),
    countLabel(profile.clubsAvailable.length, "club"),
    profile.localResearchAvailable ? "research is realistic" : "research is limited",
  ].join(" • ");

  const profilePreview = [
    countLabel(profile.extracurriculars.length, "activity"),
    countLabel(profile.leadershipRoles.length, "leadership role"),
    profile.weaknesses[0] || "no gap picked yet",
  ].join(" • ");

  const optionalPreview = [
    profile.testSituation,
    profile.personalStatementThemes.length ? `${profile.personalStatementThemes.length} essay themes` : "no essay notes yet",
  ].join(" • ");

  return (
    <section id="intake" className="section-shell mt-10 sm:mt-12">
      <div className="glass-card bg-panel p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-3 border-b border-line pb-6">
          <p className="soft-label">Student Profile</p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">Build the plan in a few quick sections</h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            Start with the basics. Add more context only where it changes the recommendation.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <AccordionItem title="Goals" preview={goalsPreview} defaultOpen>
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="Dream major">
                <input
                  className={inputClassName}
                  value={profile.dreamMajor}
                  onChange={(event) => updateField("dreamMajor", event.target.value)}
                  placeholder="Computer Science"
                />
              </FieldShell>

              <FieldShell label="Dream universities" hint="Comma-separated">
                <input
                  className={inputClassName}
                  value={csvDrafts.dreamUniversities}
                  onChange={handleCsvField("dreamUniversities")}
                  placeholder="Stanford, Carnegie Mellon, Arizona State University"
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
                <select className={inputClassName} value={profile.gpaRange} onChange={(event) => updateField("gpaRange", event.target.value)}>
                  {formOptions.gpaRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Budget level">
                <select
                  className={inputClassName}
                  value={profile.budgetLevel}
                  onChange={(event) => updateField("budgetLevel", event.target.value as StudentProfile["budgetLevel"])}
                >
                  {formOptions.budgetLevels.map((budget) => (
                    <option key={budget} value={budget}>
                      {labelize(budget)}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Location preference">
                <select
                  className={inputClassName}
                  value={profile.locationPreference}
                  onChange={(event) => updateField("locationPreference", event.target.value as StudentProfile["locationPreference"])}
                >
                  {formOptions.locationPreferences.map((option) => (
                    <option key={option} value={option}>
                      {labelize(option)}
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
                      {labelize(option.replace("-", " "))}
                    </option>
                  ))}
                </select>
              </FieldShell>
            </div>

            <details className="mt-5 rounded-[24px] border border-line bg-[#fff8f2] p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-ink">More preferences</summary>
              <div className="mt-4 grid gap-5 lg:grid-cols-2">
                <FieldShell label="Career interests" hint="Optional, comma-separated">
                  <input
                    className={inputClassName}
                    value={csvDrafts.careerInterests}
                    onChange={handleCsvField("careerInterests")}
                    placeholder="AI engineer, founder, policy analyst"
                  />
                </FieldShell>

                <FieldShell label="Dream summer programs" hint="Optional, comma-separated">
                  <input
                    className={inputClassName}
                    value={csvDrafts.dreamPrograms}
                    onChange={handleCsvField("dreamPrograms")}
                    placeholder="Summit AI Research Lab, Civic Humanities Fellows"
                  />
                </FieldShell>

                <FieldShell label="Summer availability">
                  <select
                    className={inputClassName}
                    value={profile.summerAvailability}
                    onChange={(event) => updateField("summerAvailability", event.target.value as StudentProfile["summerAvailability"])}
                  >
                    {formOptions.summerAvailability.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell label="Program style" hint="Optional">
                  <div className="flex flex-wrap gap-2">
                    {formOptions.styles.map((style) => {
                      const active = profile.desiredStyles.includes(style as StudentProfile["desiredStyles"][number]);
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => {
                            const next = active
                              ? profile.desiredStyles.filter((item) => item !== style)
                              : [...profile.desiredStyles, style as StudentProfile["desiredStyles"][number]];
                            updateField("desiredStyles", next);
                          }}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition",
                            active ? "border-[#d5b89e] bg-[#f1dfcf] text-ink" : "border-line bg-[#fffdfa] text-slate-600 hover:bg-[#fbf2e8]",
                          )}
                        >
                          {labelize(style)}
                        </button>
                      );
                    })}
                  </div>
                </FieldShell>
              </div>
            </details>
          </AccordionItem>

          <AccordionItem title="School context" preview={schoolPreview}>
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="Advanced courses available" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.coursesAvailable}
                  onChange={handleCsvField("coursesAvailable")}
                  placeholder="AP Computer Science A, AP Calculus AB, Honors English"
                />
              </FieldShell>

              <FieldShell label="Clubs available" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.clubsAvailable}
                  onChange={handleCsvField("clubsAvailable")}
                  placeholder="Robotics Club, HOSA, Debate, DECA"
                />
              </FieldShell>

              <FieldShell label="Leadership opportunities" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.leadershipOpportunities}
                  onChange={handleCsvField("leadershipOpportunities")}
                  placeholder="club officer roles, yearbook editor, student government committee chair"
                />
              </FieldShell>

              <FieldShell label="Counseling support">
                <select
                  className={inputClassName}
                  value={profile.counselingSupport}
                  onChange={(event) => updateField("counselingSupport", event.target.value as StudentProfile["counselingSupport"])}
                >
                  {formOptions.counselingSupport.map((option) => (
                    <option key={option} value={option}>
                      {labelize(option)}
                    </option>
                  ))}
                </select>
              </FieldShell>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <ToggleRow label="Is research realistic locally?" value={profile.localResearchAvailable} onChange={(value) => updateField("localResearchAvailable", value)} />
              <ToggleRow label="Are internships realistic?" value={profile.internshipsAvailable} onChange={(value) => updateField("internshipsAvailable", value)} />
              <ToggleRow
                label="Is volunteering or shadowing realistic?"
                value={profile.volunteeringShadowingAvailable}
                onChange={(value) => updateField("volunteeringShadowingAvailable", value)}
              />
            </div>
          </AccordionItem>

          <AccordionItem title="Current profile" preview={profilePreview}>
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="Current extracurriculars" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.extracurriculars}
                  onChange={handleCsvField("extracurriculars")}
                  placeholder="Robotics Club, debate, hospital volunteering"
                />
              </FieldShell>

              <FieldShell label="Current leadership roles" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.leadershipRoles}
                  onChange={handleCsvField("leadershipRoles")}
                  placeholder="debate captain, DECA officer, yearbook editor"
                />
              </FieldShell>

              <FieldShell label="Projects, awards, or competitions" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.projectsAwardsCompetitions}
                  onChange={handleCsvField("projectsAwardsCompetitions")}
                  placeholder="science fair project, hackathon finalist, published article"
                />
              </FieldShell>

              <FieldShell label="Strengths" hint="Comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.strengths}
                  onChange={handleCsvField("strengths")}
                  placeholder="writing voice, math, initiative"
                />
              </FieldShell>

              <div className="lg:col-span-2">
                <FieldShell label="Weaknesses or concerns" hint="Comma-separated">
                  <textarea
                    className={textAreaClassName}
                    value={csvDrafts.weaknesses}
                    onChange={handleCsvField("weaknesses")}
                    placeholder="limited research, weak leadership depth, no clear story yet"
                  />
                </FieldShell>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Optional testing and essay context" preview={optionalPreview}>
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="Current SAT / ACT status">
                <select
                  className={inputClassName}
                  value={profile.testSituation}
                  onChange={(event) => updateField("testSituation", event.target.value as StudentProfile["testSituation"])}
                >
                  {formOptions.testSituation.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Testing confidence">
                <select
                  className={inputClassName}
                  value={profile.testingConfidence}
                  onChange={(event) => updateField("testingConfidence", event.target.value as StudentProfile["testingConfidence"])}
                >
                  {formOptions.confidence.map((option) => (
                    <option key={option} value={option}>
                      {labelize(option)}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Possible essay themes" hint="Optional, comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.personalStatementThemes}
                  onChange={handleCsvField("personalStatementThemes")}
                  placeholder="building tools for others, speaking up, family responsibility"
                />
              </FieldShell>

              <FieldShell label="Important experiences or background context" hint="Optional, comma-separated">
                <textarea
                  className={textAreaClassName}
                  value={csvDrafts.majorExperiences}
                  onChange={handleCsvField("majorExperiences")}
                  placeholder="self-taught programming, helping classmates with math, part-time work"
                />
              </FieldShell>
            </div>
          </AccordionItem>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            You’ll get a quick strategy first, then deeper sections for school choices, summer options, testing, essays, and colleges.
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={onSubmit}
            className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {loading ? "Building the plan..." : "Build my plan"}
          </button>
        </div>
      </div>
    </section>
  );
}
