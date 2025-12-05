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

    if (!body?.medicationName) {
      return NextResponse.json(
        { error: "medicationName is required." },
        { status: 400 }
      );
    }

    let treatmentPlanId: string | null = null;
    if (body?.treatmentPlanId) {
      const plan = await prisma.treatmentPlan.findFirst({
        where: { id: body.treatmentPlanId, patientId },
        select: { id: true },
      });
      if (!plan) {
        return NextResponse.json(
          { error: "treatmentPlanId does not exist for this patient." },
          { status: 400 }
        );
      }
      treatmentPlanId = plan.id;
    }

    const medicationOrder = await prisma.medicationOrder.create({
      data: {
        patientId,
        treatmentPlanId,
        medicationName: body.medicationName,
        dosage: body?.dosage ?? null,
        route: body?.route ?? undefined,
        frequency: body?.frequency ?? null,
        startDate: parseDate(body?.startDate),
        endDate: parseDate(body?.endDate),
        prescribingProvider: body?.prescribingProvider ?? null,
        instructions: body?.instructions ?? null,
      },
      select: {
        id: true,
        patientId: true,
        treatmentPlanId: true,
        medicationName: true,
        dosage: true,
        route: true,
        frequency: true,
        startDate: true,
        endDate: true,
        prescribingProvider: true,
        instructions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ medicationOrder });
  } catch (error) {
    console.error("MedicationOrder POST error:", error);
    return NextResponse.json(
      { error: "Unable to create medication order." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams = await resolveParams(params);
    const patientId = resolvedParams.patientId ?? body?.patientId;
    const medicationOrderId = body?.id as string | undefined;

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    if (!medicationOrderId || typeof medicationOrderId !== "string") {
      return NextResponse.json(
        { error: "Medication order id is required for update." },
        { status: 400 }
      );
    }

    let treatmentPlanId: string | null | undefined =
      body?.treatmentPlanId === "" ? null : body?.treatmentPlanId;
    if (body?.treatmentPlanId) {
      const plan = await prisma.treatmentPlan.findFirst({
        where: { id: body.treatmentPlanId, patientId },
        select: { id: true },
      });
      if (!plan) {
        return NextResponse.json(
          { error: "treatmentPlanId does not exist for this patient." },
          { status: 400 }
        );
      }
      treatmentPlanId = plan.id;
    } else if (body?.treatmentPlanId === null || body?.treatmentPlanId === "") {
      treatmentPlanId = null;
    } else if (body?.treatmentPlanId === undefined) {
      treatmentPlanId = undefined;
    }

    const medicationOrder = await prisma.medicationOrder.update({
      where: { id: medicationOrderId, patientId },
      data: {
        treatmentPlanId,
        medicationName: body?.medicationName ?? undefined,
        dosage: body?.dosage ?? undefined,
        route: body?.route ?? undefined,
        frequency: body?.frequency ?? undefined,
        startDate:
          body?.startDate !== undefined ? parseDate(body.startDate) : undefined,
        endDate:
          body?.endDate !== undefined ? parseDate(body.endDate) : undefined,
        prescribingProvider: body?.prescribingProvider ?? undefined,
        instructions: body?.instructions ?? undefined,
      },
      select: {
        id: true,
        patientId: true,
        treatmentPlanId: true,
        medicationName: true,
        dosage: true,
        route: true,
        frequency: true,
        startDate: true,
        endDate: true,
        prescribingProvider: true,
        instructions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ medicationOrder });
  } catch (error) {
    console.error("MedicationOrder PUT error:", error);
    return NextResponse.json(
      { error: "Unable to update medication order." },
      { status: 500 }
    );
  }
}

