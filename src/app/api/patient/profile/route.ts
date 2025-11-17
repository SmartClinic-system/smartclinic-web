import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

function parseDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");

  if (!patientId) {
    return NextResponse.json(
      { error: "patientId query parameter is required." },
      { status: 400 }
    );
  }

  const profileDelegate = (prisma as any).patientProfile;
  const profile = await profileDelegate.findUnique({
    where: { patientId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      patientId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
    } = body ?? {};

    if (
      !patientId ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender ||
      !phoneNumber ||
      !email
    ) {
      return NextResponse.json(
        {
          error:
            "patientId, firstName, lastName, dateOfBirth, gender, phoneNumber, and email are required.",
        },
        { status: 400 }
      );
    }

    const parsedDate = parseDate(dateOfBirth);
    if (!parsedDate) {
      return NextResponse.json(
        { error: "dateOfBirth must be a valid date." },
        { status: 400 }
      );
    }

    const profileDelegate = (prisma as any).patientProfile;
    const profile = await profileDelegate.upsert({
      where: { patientId },
      create: {
        patientId,
        firstName,
        lastName,
        dateOfBirth: parsedDate,
        gender,
        phoneNumber,
        email,
      },
      update: {
        firstName,
        lastName,
        dateOfBirth: parsedDate,
        gender,
        phoneNumber,
        email,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Patient profile POST error:", error);
    return NextResponse.json(
      { error: "Unable to process patient profile request." },
      { status: 500 }
    );
  }
}
