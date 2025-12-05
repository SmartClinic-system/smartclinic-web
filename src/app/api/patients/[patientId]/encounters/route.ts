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

    const startTime = parseDate(body?.startTime);
    if (!startTime) {
      return NextResponse.json(
        { error: "startTime is required and must be a valid date string." },
        { status: 400 }
      );
    }

    const medicalRecordId = await ensureMedicalRecordId(patientId);

    const encounter = await prisma.encounter.create({
      data: {
        patientId,
        medicalRecordId,
        type: body?.type ?? "ROUTINE",
        status: body?.status ?? undefined,
        reason: body?.reason ?? null,
        location: body?.location ?? null,
        startTime,
        endTime: parseDate(body?.endTime),
        notes: body?.notes ?? null,
      },
      select: {
        id: true,
        medicalRecordId: true,
        patientId: true,
        type: true,
        status: true,
        reason: true,
        location: true,
        startTime: true,
        endTime: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ encounter });
  } catch (error) {
    console.error("Encounter POST error:", error);
    return NextResponse.json(
      { error: "Unable to create encounter." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams = await resolveParams(params);
    const patientId = resolvedParams.patientId ?? body?.patientId;
    const encounterId = body?.id as string | undefined;

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    if (!encounterId || typeof encounterId !== "string") {
      return NextResponse.json(
        { error: "Encounter id is required for update." },
        { status: 400 }
      );
    }

    const startTime = body?.startTime ? parseDate(body.startTime) : undefined;
    const endTime =
      body?.endTime !== undefined ? parseDate(body.endTime) : undefined;

    const encounter = await prisma.encounter.update({
      where: { id: encounterId, patientId },
      data: {
        type: body?.type ?? undefined,
        status: body?.status ?? undefined,
        reason: body?.reason ?? undefined,
        location: body?.location ?? undefined,
        startTime,
        endTime,
        notes: body?.notes ?? undefined,
      },
      select: {
        id: true,
        medicalRecordId: true,
        patientId: true,
        type: true,
        status: true,
        reason: true,
        location: true,
        startTime: true,
        endTime: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ encounter });
  } catch (error) {
    console.error("Encounter PUT error:", error);
    return NextResponse.json(
      { error: "Unable to update encounter." },
      { status: 500 }
    );
  }
}

