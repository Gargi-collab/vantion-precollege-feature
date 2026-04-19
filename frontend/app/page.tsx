"use client";

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { HeroSection } from "@/components/HeroSection";
import { LoadingExperience } from "@/components/LoadingExperience";
import { ResultsWorkspace } from "@/components/ResultsWorkspace";
import { StudentProfileForm } from "@/components/StudentProfileForm";
import { TopNav } from "@/components/TopNav";
import { sampleProfile } from "@/lib/constants";
import { normalizeProfileForSubmit } from "@/lib/utils";
import { MatchResponse, StudentProfile } from "@/types";

const initialProfile: StudentProfile = {
  dreamMajor: "",
  dreamUniversities: [],
  dreamPrograms: [],
  academicInterests: [],
  careerInterests: [],
  gradeLevel: "11",
  gpaRange: "3.6-3.8",
  budgetLevel: "moderate",
  locationPreference: "no strong preference",
  summerAvailability: "4-6 weeks",
  selectivityComfort: "balanced",
  desiredStyles: [],
  coursesAvailable: [],
  clubsAvailable: [],
  leadershipOpportunities: [],
  localResearchAvailable: false,
  internshipsAvailable: false,
  volunteeringShadowingAvailable: false,
  counselingSupport: "moderate",
  extracurriculars: [],
  leadershipRoles: [],
  projectsAwardsCompetitions: [],
  strengths: [],
  weaknesses: [],
  testSituation: "no SAT/ACT yet",
  testingConfidence: "medium",
  personalStatementThemes: [],
  majorExperiences: [],
  essayWritingConfidence: "medium",
};

export default function HomePage() {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = normalizeProfileForSubmit(profile.dreamMajor ? profile : sampleProfile);
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = (await response.json()) as MatchResponse;
      setResult(data);
    } catch {
      setError("We couldn't generate matches right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pb-10">
      <TopNav />
      <HeroSection />
      <StudentProfileForm profile={profile} onChange={setProfile} onSubmit={handleSubmit} loading={loading} />
      {loading ? <LoadingExperience /> : null}
      {!loading && error ? (
        <section className="section-shell mt-8">
          <div className="glass-card border border-red-100 p-6 text-red-700">{error}</div>
        </section>
      ) : null}
      {!loading && result ? <ResultsWorkspace data={result} /> : null}
      {!loading && !result && !error ? <EmptyState /> : null}
    </main>
  );
}
