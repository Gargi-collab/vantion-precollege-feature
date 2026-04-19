"use client";

import { ChangeEvent, useState } from "react";
import { formOptions, sampleProfiles } from "@/lib/constants";
import { cn, labelize } from "@/lib/utils";
import { StudentProfile } from "@/types";

interface StudentProfileFormProps {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  onSubmit: () => void;
  loading: boolean;
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
  children: React.ReactNode;
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

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="lg:col-span-2 border-t border-line pt-6 first:border-t-0 first:pt-0">
      <p className="soft-label">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{copy}</p>
    </div>
  );
}

export function StudentProfileForm({ profile, onChange, onSubmit, loading }: StudentProfileFormProps) {
  const [csvDrafts, setCsvDrafts] = useState<Record<CsvField, string>>(() => buildCsvDrafts(profile));

  const updateField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    onChange({ ...profile, [field]: value });
  };

  const applyProfile = (nextProfile: StudentProfile) => {
    setCsvDrafts(buildCsvDrafts(nextProfile));
    onChange(nextProfile);
  };

  const inputClassName =
    "w-full rounded-[22px] border border-line bg-[#fffdfa] px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100/50";
  const textAreaClassName = `${inputClassName} min-h-[110px] resize-y`;

  const handleCsvField =
    (
      field: CsvField,
    ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const rawValue = event.target.value;
      setCsvDrafts((current) => ({ ...current, [field]: rawValue }));
      updateField(field, parseCsv(rawValue));
    };

  const toggleStyle = (style: StudentProfile["desiredStyles"][number]) => {
    const next = profile.desiredStyles.includes(style)
      ? profile.desiredStyles.filter((item) => item !== style)
      : [...profile.desiredStyles, style];
    updateField("desiredStyles", next);
  };

  return (
    <section id="intake" className="section-shell mt-10 sm:mt-12">
      <div className="glass-card bg-panel p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <p className="soft-label">Student Intake</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">
              Map the student’s goals, school context, and current profile
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This goes beyond program matching. Vantion uses what the student wants, what their school actually offers, and what gaps still need to be closed.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleProfiles.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => applyProfile(sample.profile)}
                className="inline-flex h-fit items-center justify-center rounded-full border border-line bg-[#fff8f2] px-4 py-2 text-sm font-semibold text-ink transition hover:bg-[#fbf1e6]"
                title={sample.description}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <SectionHeader
            eyebrow="Student Goals"
            title="Where does this student want to go?"
            copy="Capture the aspiration level, academic direction, and practical constraints that should shape every recommendation."
          />

          <FieldShell label="Dream major">
            <input className={inputClassName} value={profile.dreamMajor} onChange={(e) => updateField("dreamMajor", e.target.value)} placeholder="Computer Science" />
          </FieldShell>

          <FieldShell label="Dream universities" hint="Comma-separated">
            <input className={inputClassName} value={csvDrafts.dreamUniversities} onChange={handleCsvField("dreamUniversities")} placeholder="Stanford, Carnegie Mellon, ASU" />
          </FieldShell>

          <FieldShell label="Dream pre-college programs" hint="Optional, comma-separated">
            <input className={inputClassName} value={csvDrafts.dreamPrograms} onChange={handleCsvField("dreamPrograms")} placeholder="Summit AI Research Lab, RSI-style research programs" />
          </FieldShell>

          <FieldShell label="Academic interests" hint="Comma-separated">
            <input className={inputClassName} value={csvDrafts.academicInterests} onChange={handleCsvField("academicInterests")} placeholder="AI, robotics, machine learning" />
          </FieldShell>

          <FieldShell label="Career interests" hint="Comma-separated">
            <input className={inputClassName} value={csvDrafts.careerInterests} onChange={handleCsvField("careerInterests")} placeholder="AI engineer, founder, researcher" />
          </FieldShell>

          <FieldShell label="Grade level">
            <select className={inputClassName} value={profile.gradeLevel} onChange={(e) => updateField("gradeLevel", e.target.value as StudentProfile["gradeLevel"])}>
              {formOptions.gradeLevels.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}th grade
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="GPA range">
            <select className={inputClassName} value={profile.gpaRange} onChange={(e) => updateField("gpaRange", e.target.value)}>
              {formOptions.gpaRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="Budget level">
            <select className={inputClassName} value={profile.budgetLevel} onChange={(e) => updateField("budgetLevel", e.target.value as StudentProfile["budgetLevel"])}>
              {formOptions.budgetLevels.map((budget) => (
                <option key={budget} value={budget}>
                  {labelize(budget)}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="Location preference">
            <select className={inputClassName} value={profile.locationPreference} onChange={(e) => updateField("locationPreference", e.target.value as StudentProfile["locationPreference"])}>
              {formOptions.locationPreferences.map((option) => (
                <option key={option} value={option}>
                  {labelize(option)}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="Summer availability">
            <select className={inputClassName} value={profile.summerAvailability} onChange={(e) => updateField("summerAvailability", e.target.value as StudentProfile["summerAvailability"])}>
              {formOptions.summerAvailability.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="Selectivity comfort">
            <select className={inputClassName} value={profile.selectivityComfort} onChange={(e) => updateField("selectivityComfort", e.target.value as StudentProfile["selectivityComfort"])}>
              {formOptions.selectivityComfort.map((option) => (
                <option key={option} value={option}>
                  {labelize(option.replace("-", " "))}
                </option>
              ))}
            </select>
          </FieldShell>
          <div className="lg:col-span-2">
            <FieldShell label="Desired program style">
              <div className="flex flex-wrap gap-3">
                {formOptions.styles.map((style) => {
                  const active = profile.desiredStyles.includes(style as StudentProfile["desiredStyles"][number]);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleStyle(style as StudentProfile["desiredStyles"][number])}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition",
                        active ? "border-brand-200 bg-[#f3e7d9] text-ink" : "border-line bg-[#fffdfa] text-slate-600 hover:bg-[#fbf3ea]",
                      )}
                    >
                      {labelize(style)}
                    </button>
                  );
                })}
              </div>
            </FieldShell>
          </div>

          <SectionHeader
            eyebrow="High School Availability"
            title="What opportunities are realistically available at school?"
            copy="The student strategy should depend on what the school actually offers, not an idealized resume checklist."
          />

          <FieldShell label="AP / IB / Honors / dual enrollment available" hint="Comma-separated">
            <textarea className={textAreaClassName} value={csvDrafts.coursesAvailable} onChange={handleCsvField("coursesAvailable")} placeholder="AP Calculus AB, AP Physics 1, AP CSA, IB English, dual enrollment biology" />
          </FieldShell>

          <FieldShell label="Clubs available at school" hint="Comma-separated">
            <textarea className={textAreaClassName} value={csvDrafts.clubsAvailable} onChange={handleCsvField("clubsAvailable")} placeholder="Robotics Club, Debate, Student Government, NHS" />
          </FieldShell>

          <FieldShell label="Sports / leadership opportunities" hint="Comma-separated">
            <textarea className={textAreaClassName} value={csvDrafts.leadershipOpportunities} onChange={handleCsvField("leadershipOpportunities")} placeholder="club officer roles, team captain, peer tutoring, event organizer" />
          </FieldShell>

          <FieldShell label="Counseling support at school">
            <select className={inputClassName} value={profile.counselingSupport} onChange={(e) => updateField("counselingSupport", e.target.value as StudentProfile["counselingSupport"])}>
              {formOptions.counselingSupport.map((option) => (
                <option key={option} value={option}>
                  {labelize(option)}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="Are local research opportunities realistic?">
            <select className={inputClassName} value={profile.localResearchAvailable ? "yes" : "no"} onChange={(e) => updateField("localResearchAvailable", e.target.value === "yes")}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FieldShell>

          <FieldShell label="Are internships realistic locally?">
            <select className={inputClassName} value={profile.internshipsAvailable ? "yes" : "no"} onChange={(e) => updateField("internshipsAvailable", e.target.value === "yes")}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FieldShell>

          <FieldShell label="Are volunteering, service, or shadowing realistic?">
            <select className={inputClassName} value={profile.volunteeringShadowingAvailable ? "yes" : "no"} onChange={(e) => updateField("volunteeringShadowingAvailable", e.target.value === "yes")}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FieldShell>
          <div />

          <SectionHeader
            eyebrow="Current Student Profile"
            title="What has the student already built?"
            copy="Use the real starting point so the guidance focuses on depth, not generic wish-list advice."
          />

          <FieldShell label="Current extracurriculars" hint="Comma-separated">
            <textarea className={textAreaClassName} value={csvDrafts.extracurriculars} onChange={handleCsvField("extracurriculars")} placeholder="Coding Club, Math Team, peer tutoring" />
          </FieldShell>

          <FieldShell label="Current leadership roles" hint="Comma-separated">
            <textarea className={textAreaClassName} value={csvDrafts.leadershipRoles} onChange={handleCsvField("leadershipRoles")} placeholder="Math Team captain, tutoring coordinator" />
          </FieldShell>

          <FieldShell label="Projects / awards / competitions" hint="Comma-separated">
            <textarea className={textAreaClassName} value={csvDrafts.projectsAwardsCompetitions} onChange={handleCsvField("projectsAwardsCompetitions")} placeholder="hackathon finalist, science fair project, app build" />
          </FieldShell>

          <FieldShell label="Strengths" hint="Comma-separated">
            <textarea className={textAreaClassName} value={csvDrafts.strengths} onChange={handleCsvField("strengths")} placeholder="math, curiosity, disciplined study habits" />
          </FieldShell>

          <FieldShell label="Weaknesses / concerns" hint="Comma-separated">
            <textarea className={textAreaClassName} value={csvDrafts.weaknesses} onChange={handleCsvField("weaknesses")} placeholder="limited research, no clear essay story, weak leadership depth" />
          </FieldShell>

          <FieldShell label="Current test situation">
            <select className={inputClassName} value={profile.testSituation} onChange={(e) => updateField("testSituation", e.target.value as StudentProfile["testSituation"])}>
              {formOptions.testSituation.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="Confidence with standardized testing">
            <select className={inputClassName} value={profile.testingConfidence} onChange={(e) => updateField("testingConfidence", e.target.value as StudentProfile["testingConfidence"])}>
              {formOptions.confidence.map((option) => (
                <option key={option} value={option}>
                  {labelize(option)}
                </option>
              ))}
            </select>
          </FieldShell>
          <div />

          <SectionHeader
            eyebrow="Writing and Essay Profile"
            title="What kind of story might this student tell?"
            copy="Capture the experiences and themes that could lead to a real essay later."
          />

          <FieldShell label="Likely personal statement themes" hint="Comma-separated">
            <textarea className={textAreaClassName} value={csvDrafts.personalStatementThemes} onChange={handleCsvField("personalStatementThemes")} placeholder="building tools for others, resilience, curiosity, family responsibility" />
          </FieldShell>

          <FieldShell label="Major experiences / challenges / identity factors" hint="Comma-separated">
            <textarea className={textAreaClassName} value={csvDrafts.majorExperiences} onChange={handleCsvField("majorExperiences")} placeholder="self-taught coding, first-generation context, major life challenge, mentor influence" />
          </FieldShell>

          <FieldShell label="Confidence with writing essays">
            <select className={inputClassName} value={profile.essayWritingConfidence} onChange={(e) => updateField("essayWritingConfidence", e.target.value as StudentProfile["essayWritingConfidence"])}>
              {formOptions.confidence.map((option) => (
                <option key={option} value={option}>
                  {labelize(option)}
                </option>
              ))}
            </select>
          </FieldShell>
          <div />
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            This turns into a clear plan: school priorities, summer options, testing, essays, college list, and next steps.
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
