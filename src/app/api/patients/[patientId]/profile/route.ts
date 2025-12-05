import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type RouteParams =
  | { params: { patientId?: string } }
  | { params: Promise<{ patientId?: string }> };

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const calculateAge = (dob: Date) => {
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
};

const validatePayload = (body: any) => {
  const errors: string[] = [];

  const stringFields: string[] = [
    "firstName",
    "lastName",
    "gender",
    "phoneNumber",
    "email",
    "dateOfBirth",
  ];

  stringFields.forEach((field) => {
    if (typeof body?.[field] !== "string" || !body[field].trim()) {
      errors.push(`${field} is required.`);
    }
  });

  const parsedDob = parseDate(body?.dateOfBirth);
  if (!parsedDob) {
    errors.push("dateOfBirth must be a valid date string.");
  }

  return {
    errors,
    parsedDob,
  };
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams =
      params && typeof (params as Promise<any>).then === "function"
        ? await (params as Promise<{ patientId?: string }>)
        : (params as { patientId?: string });

    const patientId = resolvedParams?.patientId ?? body?.patientId ?? body?.id;

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    const { errors, parsedDob } = validatePayload(body);

    if (errors.length) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    const normalizedEmail = body.email.trim().toLowerCase();

    const updatedProfile = await prisma.patientProfile.update({
      where: { id: patientId },
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        gender: body.gender.trim(),
        phoneNumber: body.phoneNumber.trim(),
        email: normalizedEmail,
        dateOfBirth: parsedDob!,
      },
      select: {
        id: true,
        patientId: true,
        firstName: true,
        lastName: true,
        gender: true,
        phoneNumber: true,
        email: true,
        dateOfBirth: true,
        createdAt: true,
        medicalRecord: {
          select: {
            summary: true,
            primaryProvider: true,
            preferredPharmacy: true,
            lastReview: true,
          },
        },
      },
    });

    return NextResponse.json({
      profile: {
        id: updatedProfile.id,
        patientNumber: updatedProfile.patientId,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        fullName:
          `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim(),
        initials: `${updatedProfile.firstName?.[0] ?? ""}${
          updatedProfile.lastName?.[0] ?? ""
        }`.toUpperCase(),
        dateOfBirth: updatedProfile.dateOfBirth.toISOString(),
        age: calculateAge(updatedProfile.dateOfBirth),
        gender: updatedProfile.gender,
        phoneNumber: updatedProfile.phoneNumber,
        email: updatedProfile.email,
        createdAt: updatedProfile.createdAt.toISOString(),
        medicalRecord: updatedProfile.medicalRecord
          ? {
              summary: updatedProfile.medicalRecord.summary ?? "",
              primaryProvider:
                updatedProfile.medicalRecord.primaryProvider ?? "",
              preferredPharmacy:
                updatedProfile.medicalRecord.preferredPharmacy ?? "",
              lastReview: updatedProfile.medicalRecord.lastReview
                ? updatedProfile.medicalRecord.lastReview.toISOString()
                : null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Patient profile PUT error:", error);
    return NextResponse.json(
      { error: "Unable to update patient profile." },
      { status: 500 }
    );
  }
}
