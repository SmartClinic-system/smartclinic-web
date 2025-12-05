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

    if (typeof body?.value !== "number" || Number.isNaN(body.value)) {
      return NextResponse.json(
        { error: "value (number) is required." },
        { status: 400 }
      );
    }

    if (!body?.type) {
      return NextResponse.json(
        { error: "type is required for vital sign." },
        { status: 400 }
      );
    }

    const vitalSign = await prisma.vitalSign.create({
      data: {
        patientId,
        type: body.type,
        value: body.value,
        unit: body?.unit ?? "",
        recordedAt: parseDate(body?.recordedAt) ?? undefined,
        recordedBy: body?.recordedBy ?? null,
      },
      select: {
        id: true,
        patientId: true,
        type: true,
        value: true,
        unit: true,
        recordedAt: true,
        recordedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ vitalSign });
  } catch (error) {
    console.error("VitalSign POST error:", error);
    return NextResponse.json(
      { error: "Unable to create vital sign." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams = await resolveParams(params);
    const patientId = resolvedParams.patientId ?? body?.patientId;
    const vitalId = body?.id as string | undefined;

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    if (!vitalId || typeof vitalId !== "string") {
      return NextResponse.json(
        { error: "Vital sign id is required for update." },
        { status: 400 }
      );
    }

    const vitalSign = await prisma.vitalSign.update({
      where: { id: vitalId, patientId },
      data: {
        type: body?.type ?? undefined,
        value:
          body?.value !== undefined && !Number.isNaN(body.value)
            ? body.value
            : undefined,
        unit: body?.unit ?? undefined,
        recordedAt:
          body?.recordedAt !== undefined
            ? parseDate(body.recordedAt) ?? undefined
            : undefined,
        recordedBy: body?.recordedBy ?? undefined,
      },
      select: {
        id: true,
        patientId: true,
        type: true,
        value: true,
        unit: true,
        recordedAt: true,
        recordedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ vitalSign });
  } catch (error) {
    console.error("VitalSign PUT error:", error);
    return NextResponse.json(
      { error: "Unable to update vital sign." },
      { status: 500 }
    );
  }
}

