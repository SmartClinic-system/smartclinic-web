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

    if (!body?.testName) {
      return NextResponse.json(
        { error: "testName is required." },
        { status: 400 }
      );
    }

    const labResult = await prisma.labResult.create({
      data: {
        patientId,
        testName: body.testName,
        status: body?.status ?? undefined,
        resultValue: body?.resultValue ?? null,
        units: body?.units ?? null,
        referenceRange: body?.referenceRange ?? null,
        collectedAt: parseDate(body?.collectedAt),
        resultedAt: parseDate(body?.resultedAt),
        orderingProvider: body?.orderingProvider ?? null,
        notes: body?.notes ?? null,
      },
      select: {
        id: true,
        patientId: true,
        testName: true,
        status: true,
        resultValue: true,
        units: true,
        referenceRange: true,
        collectedAt: true,
        resultedAt: true,
        orderingProvider: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ labResult });
  } catch (error) {
    console.error("LabResult POST error:", error);
    return NextResponse.json(
      { error: "Unable to create lab result." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams = await resolveParams(params);
    const patientId = resolvedParams.patientId ?? body?.patientId;
    const labId = body?.id as string | undefined;

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    if (!labId || typeof labId !== "string") {
      return NextResponse.json(
        { error: "Lab result id is required for update." },
        { status: 400 }
      );
    }

    const labResult = await prisma.labResult.update({
      where: { id: labId, patientId },
      data: {
        testName: body?.testName ?? undefined,
        status: body?.status ?? undefined,
        resultValue: body?.resultValue ?? undefined,
        units: body?.units ?? undefined,
        referenceRange: body?.referenceRange ?? undefined,
        collectedAt:
          body?.collectedAt !== undefined
            ? parseDate(body.collectedAt)
            : undefined,
        resultedAt:
          body?.resultedAt !== undefined ? parseDate(body.resultedAt) : undefined,
        orderingProvider: body?.orderingProvider ?? undefined,
        notes: body?.notes ?? undefined,
      },
      select: {
        id: true,
        patientId: true,
        testName: true,
        status: true,
        resultValue: true,
        units: true,
        referenceRange: true,
        collectedAt: true,
        resultedAt: true,
        orderingProvider: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ labResult });
  } catch (error) {
    console.error("LabResult PUT error:", error);
    return NextResponse.json(
      { error: "Unable to update lab result." },
      { status: 500 }
    );
  }
}

