"use client";

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { HeroSection } from "@/components/HeroSection";
import { LoadingExperience } from "@/components/LoadingExperience";
import { ResultsWorkspace } from "@/components/ResultsWorkspace";
import { StudentProfileForm } from "@/components/StudentProfileForm";
import { TopNav } from "@/components/TopNav";
import { initialProfile, sampleProfiles } from "@/lib/constants";
import { normalizeProfileForSubmit } from "@/lib/utils";
import { MatchResponse, StudentProfile } from "@/types";

export default function HomePage() {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [profileSyncKey, setProfileSyncKey] = useState(0);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyPreset = (presetId: string) => {
    const preset = sampleProfiles.find((item) => item.id === presetId);
    if (!preset) return;

    setProfile(preset.profile);
    setActivePresetId(presetId);
    setProfileSyncKey((current) => current + 1);
    setResult(null);
    setError(null);

    document.getElementById("intake")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async () => {
    const payload = normalizeProfileForSubmit(profile);
    if (!payload.dreamMajor && payload.academicInterests.length === 0) {
      setError("Add a major or at least one interest so we can match the right programs.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
      requestAnimationFrame(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch {
      setError("We couldn't match programs right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="top" className="pb-14">
      <TopNav />
      <HeroSection
        activePresetId={activePresetId}
        onSelectPreset={applyPreset}
        presets={sampleProfiles.map(({ id, label, description }) => ({ id, label, description }))}
      />
      <StudentProfileForm profile={profile} onChange={setProfile} onSubmit={handleSubmit} loading={loading} syncKey={profileSyncKey} />

      {loading ? <LoadingExperience /> : null}

      {!loading && error ? (
        <section className="section-shell mt-8">
          <div className="rounded-[28px] border border-red-100 bg-[#fff7f5] p-5 text-sm text-red-700">{error}</div>
        </section>
      ) : null}

      {!loading && result ? <ResultsWorkspace data={result} /> : null}
      {!loading && !result && !error ? <EmptyState /> : null}
    </main>
  );
}
