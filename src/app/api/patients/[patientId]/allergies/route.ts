import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type Params = { patientId: string };
type RouteParams = { params: Params } | { params: Promise<Params> };

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const resolveParams = async (params: RouteParams["params"]) => {
  if (params && typeof (params as Promise<any>).then === "function") {
    return (await (params as Promise<Params>)) ?? {};
  }
  return (params as Params) ?? {};
};

const ensureMedicalRecordId = async (patientId: string) => {
  const existing = await prisma.electronicMedicalRecord.findUnique({
    where: { patientId },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.electronicMedicalRecord.create({
    data: { patientId },
    select: { id: true },
  });
  return created.id;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams = await resolveParams(params);
    const patientId = resolvedParams.patientId ?? body?.patientId;

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    if (!body?.allergen) {
      return NextResponse.json(
        { error: "allergen is required." },
        { status: 400 }
      );
    }

    const medicalRecordId = await ensureMedicalRecordId(patientId);

    const allergy = await prisma.allergy.create({
      data: {
        patientId,
        medicalRecordId,
        allergen: body.allergen,
        reaction: body?.reaction ?? null,
        severity: body?.severity ?? undefined,
        isActive:
          typeof body?.isActive === "boolean" ? body.isActive : undefined,
        notedAt: parseDate(body?.notedAt),
        notes: body?.notes ?? null,
      },
      select: {
        id: true,
        patientId: true,
        medicalRecordId: true,
        allergen: true,
        reaction: true,
        severity: true,
        isActive: true,
        notedAt: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ allergy });
  } catch (error) {
    console.error("Allergy POST error:", error);
    return NextResponse.json(
      { error: "Unable to create allergy." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams = await resolveParams(params);
    const patientId = resolvedParams.patientId ?? body?.patientId;
    const allergyId = body?.id as string | undefined;

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    if (!allergyId || typeof allergyId !== "string") {
      return NextResponse.json(
        { error: "Allergy id is required for update." },
        { status: 400 }
      );
    }

    const allergy = await prisma.allergy.update({
      where: { id: allergyId, patientId },
      data: {
        allergen: body?.allergen ?? undefined,
        reaction: body?.reaction ?? undefined,
        severity: body?.severity ?? undefined,
        isActive:
          typeof body?.isActive === "boolean" ? body.isActive : undefined,
        notedAt:
          body?.notedAt !== undefined ? parseDate(body.notedAt) : undefined,
        notes: body?.notes ?? undefined,
      },
      select: {
        id: true,
        patientId: true,
        medicalRecordId: true,
        allergen: true,
        reaction: true,
        severity: true,
        isActive: true,
        notedAt: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ allergy });
  } catch (error) {
    console.error("Allergy PUT error:", error);
    return NextResponse.json(
      { error: "Unable to update allergy." },
      { status: 500 }
    );
  }
}

