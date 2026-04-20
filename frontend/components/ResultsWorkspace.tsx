import { AccordionItem } from "@/components/AccordionItem";
import { MatchResponse } from "@/types";
import { ActionPlanPanel } from "./ActionPlanPanel";
import { CollegeListPanel } from "./CollegeListPanel";
import { EssayStrategyPanel } from "./EssayStrategyPanel";
import { ProgramStrategySection } from "./ProgramStrategySection";
import { SchoolOpportunityPanel } from "./SchoolOpportunityPanel";
import { StrategySummaryCard } from "./StrategySummaryCard";
import { TestingStrategyPanel } from "./TestingStrategyPanel";

export function ResultsWorkspace({ data }: { data: MatchResponse }) {
  const topCourse = data.insights.schoolOpportunityStrategy.priorityCourses[0]?.name || "No course picked yet";
  const topActivity = data.insights.schoolOpportunityStrategy.priorityActivities[0]?.name || "No activity picked yet";
  const topProgram = data.matches[0]?.program.name || "No summer option yet";
  const topTheme = data.insights.essayStrategy.promisingThemes[0] || "Essay notes";

  return (
    <section id="workspace" className="section-shell mt-10 pb-16 sm:mt-12">
      <div className="max-w-4xl">
        <p className="soft-label">Your Plan</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">Here’s where to focus first</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{data.counselorSummary}</p>
      </div>

      <div className="mt-6">
        <StrategySummaryCard summary={data.insights.atGlance} />
      </div>

      <div className="mt-6 space-y-4">
        <AccordionItem title="School Strategy" preview={`Start with ${topCourse}. Then go deeper in ${topActivity}.`}>
          <SchoolOpportunityPanel strategy={data.insights.schoolOpportunityStrategy} />
        </AccordionItem>

        <AccordionItem title="Summer Programs" preview={`Top pick: ${topProgram}. Only the 1–3 best-fit options are shown.`}>
          <ProgramStrategySection matches={data.matches} />
        </AccordionItem>

        <AccordionItem title="Testing" preview={data.insights.testingStrategy.recommendation}>
          <TestingStrategyPanel strategy={data.insights.testingStrategy} />
        </AccordionItem>

        <AccordionItem title="Essays" preview={`Start with ${topTheme}.`}>
          <EssayStrategyPanel strategy={data.insights.essayStrategy} />
        </AccordionItem>

        <AccordionItem
          title="College List"
          preview={`Reach: ${data.insights.collegeListStrategy.reach[0]?.name || "TBD"} • Target: ${data.insights.collegeListStrategy.target[0]?.name || "TBD"} • Safe: ${data.insights.collegeListStrategy.safety[0]?.name || "TBD"}`}
        >
          <CollegeListPanel strategy={data.insights.collegeListStrategy} />
        </AccordionItem>

        <AccordionItem title="Action Plan" preview={data.insights.actionPlan.biggestFirstPriority}>
          <ActionPlanPanel plan={data.insights.actionPlan} />
        </AccordionItem>
      </div>
    </section>
  );
}
