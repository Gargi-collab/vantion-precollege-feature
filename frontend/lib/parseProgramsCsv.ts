import "server-only";

import fs from "fs";
import path from "path";
import { PreCollegeProgram, ProgramCsvRecord } from "@/types";

let cachedPrograms: PreCollegeProgram[] | null = null;

function parseCsvText(text: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }

      currentRow.push(currentCell);
      if (currentRow.some((value) => value.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

function parsePipeList(value: string) {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseOptionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function toProgram(record: ProgramCsvRecord): PreCollegeProgram {
  return {
    id: record.program_id,
    name: record.program_name,
    institution: record.institution,
    sourceType: record.source_type,
    sourceUrl: record.source_url,
    primaryField: record.primary_field,
    secondaryFields: parsePipeList(record.secondary_fields),
    interests: parsePipeList(record.interests),
    goals: parsePipeList(record.goals),
    budget: record.budget,
    format: record.format,
    locationPreference: record.location_preference,
    city: record.city,
    stateOrCountry: record.state_or_country,
    region: record.region,
    selectivity: record.selectivity,
    duration: record.duration,
    durationWeeks: parseOptionalNumber(record.duration_weeks),
    season: record.season,
    gradeMin: parseOptionalNumber(record.grade_min),
    gradeMax: parseOptionalNumber(record.grade_max),
    supportType: record.support_type,
    tuitionUsd: parseOptionalNumber(record.tuition_usd),
    financialAid: record.financial_aid,
    residentialOption: record.residential_option,
    description: record.description,
    keywords: parsePipeList(record.keywords),
    academicStrengthTarget: record.academic_strength_target,
    recommendedGpaRange: record.recommended_gpa_range,
    courseworkBackgroundExpected: record.coursework_background_expected,
    priorExperienceExpected: record.prior_experience_expected,
    academicRigorLevel: record.academic_rigor_level,
    prerequisiteNotes: record.prerequisite_notes,
  };
}

export function getProgramsFromCsv() {
  if (cachedPrograms) return cachedPrograms;

  const csvPath = path.join(process.cwd(), "data", "programs.csv");
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCsvText(csvText);
  const [header, ...dataRows] = rows;

  const records = dataRows.map((row) => {
    const pairs = header.map((column, index) => [column, row[index] ?? ""]);
    return Object.fromEntries(pairs) as ProgramCsvRecord;
  });

  cachedPrograms = records.map(toProgram);
  return cachedPrograms;
}
