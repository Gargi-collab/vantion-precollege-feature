import { ProgramRecommendation, ScoreBreakdown, StudentProfile, PreCollegeProgram } from "@/types";

function hashValue(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function pickVariant(seed: string, key: string, options: string[]) {
  return options[hashValue(`${seed}:${key}`) % options.length];
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function budgetReason(profile: StudentProfile, program: PreCollegeProgram) {
  if (profile.budgetComfort === "low" && (program.tuitionUsd ?? 0) <= 1200) return "Lower-cost option.";
  if (profile.budgetComfort === "low" && program.financialAid === "yes") return "Aid may make this workable.";
  if (profile.budgetComfort === "not a major concern") return "Budget is not a blocker here.";
  if (program.budget === "moderate") return "Cost lands in a more manageable range.";
  return "Cost is workable for this profile.";
}

function locationReason(profile: StudentProfile, program: PreCollegeProgram) {
  if (program.format === "online") return "Easy to do from anywhere.";
  if (profile.locationComfort === "local / same state" && profile.homeState.toLowerCase() === program.stateOrCountry.toLowerCase()) return "Close to home.";
  if (profile.locationComfort === "same region") return "Travel is more reasonable than a cross-country option.";
  return `${program.city}, ${program.stateOrCountry}.`;
}

function goalReason(profile: StudentProfile, program: PreCollegeProgram) {
  const goals = profile.summerGoals.join(" ").toLowerCase();

  if (goals.includes("research") && /research|faculty mentored|lab/.test(program.description.toLowerCase())) {
    return pickVariant(program.id, "research", ["Good if you want research exposure.", "Useful if you want a real research angle.", "Good match for a research-focused summer."]);
  }

  if (goals.includes("hands-on") && /project|prototype|build|capstone/.test(program.description.toLowerCase())) {
    return pickVariant(program.id, "projects", ["Good if you want to build something concrete.", "Strong pick for project-based work.", "Better fit if you want output, not just lectures."]);
  }

  if (goals.includes("leadership") && /leadership|pitch|team/.test(program.description.toLowerCase())) {
    return pickVariant(program.id, "leadership", ["Good if you want a leadership angle.", "This adds visible ownership.", "Useful if you want to lead, not just attend."]);
  }

  if (goals.includes("portfolio") && /portfolio|showcase|open source|presentation/.test(program.description.toLowerCase())) {
    return pickVariant(program.id, "portfolio", ["Good if you want something you can show later.", "This gives you work product.", "Good for building proof, not just interest."]);
  }

  return pickVariant(program.id, "goal-default", ["Clear match for the summer goal you picked.", "The program style fits what you asked for.", "The structure matches your stated goal."]);
}

function fieldReason(profile: StudentProfile, program: PreCollegeProgram) {
  const intended = profile.dreamMajor || profile.academicInterests[0] || program.primaryField;
  return pickVariant(program.id, "field", [
    `Strong fit for ${capitalize(program.primaryField)}.`,
    `Good match if ${intended} is the lane you want.`,
    `One of the better subject matches in this list.`,
  ]);
}

function formatReason(profile: StudentProfile, program: PreCollegeProgram) {
  if (profile.formatPreference === "online only") return "Matches your online preference.";
  if (profile.formatPreference === "in-person only") return program.format === "hybrid" ? "Still has in-person structure." : "Matches your in-person preference.";
  if (program.format === "hybrid") return "Nice middle ground on format.";
  return program.format === "in-person" ? "Good if you want more structure." : "Flexible format.";
}

function academicReason(program: PreCollegeProgram) {
  if (program.academicRigorLevel === "high") return "More rigorous than most options here.";
  if (program.academicStrengthTarget === "developing") return "More accessible if you're still building experience.";
  return "Academic fit looks solid.";
}

function buildBestFor(program: PreCollegeProgram) {
  const experience =
    program.priorExperienceExpected.includes("some prior")
      ? "students with some background"
      : program.priorExperienceExpected.includes("open to beginners")
        ? "students who are still building experience"
        : "students ready for a step up";

  const style =
    program.supportType.includes("faculty")
      ? "who want mentor feedback"
      : program.supportType.includes("project")
        ? "who want project-based work"
        : program.supportType.includes("portfolio")
          ? "who want portfolio pieces"
          : "who want more structure";

  return `Best for ${experience} ${style}.`;
}

function buildCaution(profile: StudentProfile, program: PreCollegeProgram, scoreBreakdown: ScoreBreakdown) {
  if (scoreBreakdown.budgetFit <= 3) return "Cost is the main tradeoff.";
  if (scoreBreakdown.selectivityFit <= 1) return "More selective than you said you want.";
  if (scoreBreakdown.locationFit <= 2 && program.format !== "online") return "Travel could be the main hurdle.";
  if (scoreBreakdown.durationFit === 0) return "Longer or shorter than your ideal.";
  if (scoreBreakdown.academicFit <= 6) return "May feel like a stretch without more background.";
  if (profile.avoidNotes && /lecture/.test(profile.avoidNotes.toLowerCase()) && /seminar|lecture|discussion/.test(program.description.toLowerCase())) {
    return "More discussion-heavy than hands-on.";
  }
  if (program.residentialOption === "available" && profile.residentialPreference === "non-residential preferred") return "Residential setup may not be ideal.";
  return pickVariant(program.id, "caution", ["Smaller brand, but the fit is still solid.", "Good fit overall, but it is not the cheapest path.", "Worth a look, but check the day-to-day format."]);
}

function buildMatchedOn(program: PreCollegeProgram, scoreBreakdown: ScoreBreakdown) {
  const labels: Array<{ label: string; score: number }> = [
    { label: `${capitalize(program.primaryField)} fit`, score: scoreBreakdown.interestAlignment },
    { label: "Summer goal match", score: scoreBreakdown.goalAlignment },
    { label: "Academic fit", score: scoreBreakdown.academicFit },
    { label: "Budget fit", score: scoreBreakdown.budgetFit },
    { label: "Format fit", score: scoreBreakdown.formatFit },
    { label: "Location fit", score: scoreBreakdown.locationFit },
  ];

  return labels
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((item) => item.label);
}

export function buildRecommendation(profile: StudentProfile, program: PreCollegeProgram, scoreBreakdown: ScoreBreakdown): Omit<ProgramRecommendation, "fitScore"> {
  const whyItFits = [
    fieldReason(profile, program),
    goalReason(profile, program),
    scoreBreakdown.locationFit >= scoreBreakdown.budgetFit ? locationReason(profile, program) : budgetReason(profile, program),
  ];

  if (scoreBreakdown.formatFit >= 7) {
    whyItFits[2] = formatReason(profile, program);
  } else if (scoreBreakdown.academicFit >= 12) {
    whyItFits[2] = academicReason(program);
  }

  return {
    program,
    scoreBreakdown,
    whyItFits,
    matchedOn: buildMatchedOn(program, scoreBreakdown),
    bestFor: buildBestFor(program),
    caution: buildCaution(profile, program, scoreBreakdown),
  };
}
