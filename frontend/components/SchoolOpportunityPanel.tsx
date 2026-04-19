"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SchoolOpportunityStrategy } from "@/types";

function PriorityPill({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles =
    priority === "high"
      ? "bg-[#f3e7d9] text-ink border-line"
      : priority === "medium"
        ? "bg-[#fff8f2] text-slate-700 border-line"
        : "bg-[#fffdfa] text-slate-500 border-line";

  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${styles}`}>{priority}</span>;
}

type SchoolView = "courses" | "activities" | "focus";

export function SchoolOpportunityPanel({ strategy }: { strategy: SchoolOpportunityStrategy }) {
  const [activeView, setActiveView] = useState<SchoolView>("courses");

  return (
    <section id="school-strategy" className="glass-card p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="soft-label">School Opportunity Strategy</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Use what the school actually offers</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start with the highest-leverage options already on campus.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "courses", label: "Priority Courses" },
            { id: "activities", label: "Priority Activities" },
            { id: "focus", label: "Leadership + Gaps" },
          ].map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setActiveView(view.id as SchoolView)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                activeView === view.id ? "border-line bg-[#efe2d2] text-ink" : "border-line bg-[#fffdfa] text-slate-600 hover:bg-[#fbf3ea]",
              )}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeView === "courses" ? (
          <div className="rounded-[28px] border border-line bg-[#fffdfa] p-5">
            <div className="space-y-4">
              {strategy.priorityCourses.map((course) => (
                <div key={course.name} className="rounded-[22px] border border-line bg-[#fffaf5] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{course.name}</p>
                    <PriorityPill priority={course.priority} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{course.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeView === "activities" ? (
          <div className="rounded-[28px] border border-line bg-[#fffdfa] p-5">
            <div className="space-y-4">
              {strategy.priorityActivities.map((activity) => (
                <div key={activity.name} className="rounded-[22px] border border-line bg-[#fffaf5] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{activity.name}</p>
                    <PriorityPill priority={activity.priority} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{activity.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeView === "focus" ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[26px] border border-line bg-[#f8f1e8] p-5">
              <h3 className="text-sm font-semibold text-slate-900">Leadership focus</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {strategy.leadershipFocus.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[26px] border border-line bg-[#fffdfa] p-5">
              <h3 className="text-sm font-semibold text-slate-900">Deprioritize</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {strategy.deprioritize.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[26px] border border-line bg-[#fff8f2] p-5">
              <h3 className="text-sm font-semibold text-slate-900">Gap closure</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {strategy.gapClosure.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
