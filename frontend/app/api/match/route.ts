import { NextResponse } from "next/server";
import { buildMatches } from "@/lib/matching";
import { StudentProfile } from "@/types";

export async function POST(request: Request) {
  try {
    const profile = (await request.json()) as StudentProfile;
    const response = buildMatches(profile);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      {
        message: "We couldn't match programs for this profile. Please check the form and try again.",
      },
      { status: 400 },
    );
  }
}
