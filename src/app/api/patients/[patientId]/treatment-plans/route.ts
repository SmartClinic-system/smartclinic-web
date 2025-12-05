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

const resolveParams = async (params: RouteParams["params"]) => {
  if (params && typeof (params as Promise<any>).then === "function") {
    return (await (params as Promise<{ patientId?: string }>)) ?? {};
  }
  return (params as { patientId?: string }) ?? {};
};

export async function POST(request: Request, { params }: RouteParams) {
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

    let encounterId: string | null = null;
    if (body?.encounterId) {
      const enc = await prisma.encounter.findFirst({
        where: { id: body.encounterId, patientId },
        select: { id: true },
      });
      if (!enc) {
        return NextResponse.json(
          { error: "encounterId does not exist for this patient." },
          { status: 400 }
        );
      }
      encounterId = enc.id;
    }

    let diagnosisId: string | null = null;
    if (body?.diagnosisId) {
      const dx = await prisma.diagnosis.findFirst({
        where: { id: body.diagnosisId, patientId },
        select: { id: true },
      });
      if (!dx) {
        return NextResponse.json(
          { error: "diagnosisId does not exist for this patient." },
          { status: 400 }
        );
      }
      diagnosisId = dx.id;
    }

    const treatmentPlan = await prisma.treatmentPlan.create({
      data: {
        patientId,
        encounterId,
        diagnosisId,
        status: body?.status ?? undefined,
        goal: body?.goal ?? null,
        startDate: parseDate(body?.startDate),
        endDate: parseDate(body?.endDate),
        notes: body?.notes ?? null,
      },
      select: {
        id: true,
        patientId: true,
        encounterId: true,
        diagnosisId: true,
        status: true,
        goal: true,
        startDate: true,
        endDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ treatmentPlan });
  } catch (error) {
    console.error("TreatmentPlan POST error:", error);
    return NextResponse.json(
      { error: "Unable to create treatment plan." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams = await resolveParams(params);
    const patientId = resolvedParams.patientId ?? body?.patientId;
    const treatmentPlanId = body?.id as string | undefined;

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    if (!treatmentPlanId || typeof treatmentPlanId !== "string") {
      return NextResponse.json(
        { error: "Treatment plan id is required for update." },
        { status: 400 }
      );
    }

    let encounterId: string | null | undefined =
      body?.encounterId === "" ? null : body?.encounterId;
    if (body?.encounterId) {
      const enc = await prisma.encounter.findFirst({
        where: { id: body.encounterId, patientId },
        select: { id: true },
      });
      if (!enc) {
        return NextResponse.json(
          { error: "encounterId does not exist for this patient." },
          { status: 400 }
        );
      }
      encounterId = enc.id;
    } else if (body?.encounterId === null || body?.encounterId === "") {
      encounterId = null;
    } else if (body?.encounterId === undefined) {
      encounterId = undefined;
    }

    let diagnosisId: string | null | undefined =
      body?.diagnosisId === "" ? null : body?.diagnosisId;
    if (body?.diagnosisId) {
      const dx = await prisma.diagnosis.findFirst({
        where: { id: body.diagnosisId, patientId },
        select: { id: true },
      });
      if (!dx) {
        return NextResponse.json(
          { error: "diagnosisId does not exist for this patient." },
          { status: 400 }
        );
      }
      diagnosisId = dx.id;
    } else if (body?.diagnosisId === null || body?.diagnosisId === "") {
      diagnosisId = null;
    } else if (body?.diagnosisId === undefined) {
      diagnosisId = undefined;
    }

    const treatmentPlan = await prisma.treatmentPlan.update({
      where: { id: treatmentPlanId, patientId },
      data: {
        encounterId,
        diagnosisId,
        status: body?.status ?? undefined,
        goal: body?.goal ?? undefined,
        startDate:
          body?.startDate !== undefined ? parseDate(body.startDate) : undefined,
        endDate:
          body?.endDate !== undefined ? parseDate(body.endDate) : undefined,
        notes: body?.notes ?? undefined,
      },
      select: {
        id: true,
        patientId: true,
        encounterId: true,
        diagnosisId: true,
        status: true,
        goal: true,
        startDate: true,
        endDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ treatmentPlan });
  } catch (error) {
    console.error("TreatmentPlan PUT error:", error);
    return NextResponse.json(
      { error: "Unable to update treatment plan." },
      { status: 500 }
    );
  }
}

