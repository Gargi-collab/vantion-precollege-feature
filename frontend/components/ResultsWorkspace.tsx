"use client";

import { useState } from "react";
import { MatchResponse } from "@/types";
import { cn } from "@/lib/utils";
import { ActionPlanPanel } from "./ActionPlanPanel";
import { CollegeListPanel } from "./CollegeListPanel";
import { EssayStrategyPanel } from "./EssayStrategyPanel";
import { ProgramStrategySection } from "./ProgramStrategySection";
import { SchoolOpportunityPanel } from "./SchoolOpportunityPanel";
import { StrategicSummaryPanel } from "./StrategicSummaryPanel";
import { TestingStrategyPanel } from "./TestingStrategyPanel";

const sections = [
  { id: "school-strategy", label: "School Strategy" },
  { id: "program-match", label: "Programs" },
  { id: "testing-strategy", label: "Testing" },
  { id: "essay-direction", label: "Essays" },
  { id: "college-list", label: "College List" },
  { id: "action-plan", label: "Roadmap" },
] as const;

type ActiveSection = (typeof sections)[number]["id"];

export function ResultsWorkspace({ data }: { data: MatchResponse }) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("school-strategy");

  return (
    <section id="workspace" className="section-shell mt-10 pb-16 sm:mt-12">
      <div className="glass-card p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-line pb-6">
          <div className="max-w-4xl">
            <p className="soft-label">Counselor Workspace</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">A plan built around this student’s real options</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{data.counselorSummary}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] border border-line bg-[#fff8f2] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quick read</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{data.insights.strategicSummary.recommendedDirection}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-line bg-[#fffdfa] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Assets</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{data.insights.strategicSummary.strongestAssets.length}</p>
              </div>
              <div className="rounded-[24px] border border-line bg-[#fffdfa] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Gaps</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{data.insights.strategicSummary.biggestGaps.length}</p>
              </div>
              <div className="rounded-[24px] border border-line bg-[#fffdfa] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Top Programs</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{data.matches.slice(0, 3).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <StrategicSummaryPanel summary={data.insights.strategicSummary} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                activeSection === section.id
                  ? "border-line bg-[#efe2d2] text-ink"
                  : "border-line bg-[#fffdfa] text-slate-600 hover:bg-[#fbf3ea]",
              )}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeSection === "school-strategy" ? <SchoolOpportunityPanel strategy={data.insights.schoolOpportunityStrategy} /> : null}
          {activeSection === "program-match" ? <ProgramStrategySection matches={data.matches} /> : null}
          {activeSection === "testing-strategy" ? <TestingStrategyPanel strategy={data.insights.testingStrategy} /> : null}
          {activeSection === "essay-direction" ? <EssayStrategyPanel strategy={data.insights.essayStrategy} /> : null}
          {activeSection === "college-list" ? <CollegeListPanel strategy={data.insights.collegeListStrategy} /> : null}
          {activeSection === "action-plan" ? <ActionPlanPanel plan={data.insights.actionPlan} /> : null}
        </div>
      </div>
    </section>
  );
}
