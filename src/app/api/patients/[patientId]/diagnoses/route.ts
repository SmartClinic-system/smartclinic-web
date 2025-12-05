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

    if (!body?.code) {
      return NextResponse.json(
        { error: "code is required for diagnosis." },
        { status: 400 }
      );
    }

    let encounterId: string | null = null;
    if (body?.encounterId) {
      const encounter = await prisma.encounter.findFirst({
        where: { id: body.encounterId, patientId },
        select: { id: true },
      });
      if (!encounter) {
        return NextResponse.json(
          { error: "encounterId does not exist for this patient." },
          { status: 400 }
        );
      }
      encounterId = encounter.id;
    }

    const diagnosis = await prisma.diagnosis.create({
      data: {
        patientId,
        encounterId,
        code: body.code,
        description: body?.description ?? null,
        status: body?.status ?? undefined,
        onsetDate: parseDate(body?.onsetDate),
        resolvedDate: parseDate(body?.resolvedDate),
      },
      select: {
        id: true,
        patientId: true,
        encounterId: true,
        code: true,
        description: true,
        status: true,
        onsetDate: true,
        resolvedDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ diagnosis });
  } catch (error) {
    console.error("Diagnosis POST error:", error);
    return NextResponse.json(
      { error: "Unable to create diagnosis." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams = await resolveParams(params);
    const patientId = resolvedParams.patientId ?? body?.patientId;
    const diagnosisId = body?.id as string | undefined;

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    if (!diagnosisId || typeof diagnosisId !== "string") {
      return NextResponse.json(
        { error: "Diagnosis id is required for update." },
        { status: 400 }
      );
    }

    let encounterId: string | null | undefined =
      body?.encounterId === "" ? null : body?.encounterId;
    if (body?.encounterId) {
      const encounter = await prisma.encounter.findFirst({
        where: { id: body.encounterId, patientId },
        select: { id: true },
      });
      if (!encounter) {
        return NextResponse.json(
          { error: "encounterId does not exist for this patient." },
          { status: 400 }
        );
      }
      encounterId = encounter.id;
    } else if (body?.encounterId === null || body?.encounterId === "") {
      encounterId = null;
    } else if (body?.encounterId === undefined) {
      encounterId = undefined;
    }

    const diagnosis = await prisma.diagnosis.update({
      where: { id: diagnosisId, patientId },
      data: {
        encounterId,
        code: body?.code ?? undefined,
        description: body?.description ?? undefined,
        status: body?.status ?? undefined,
        onsetDate:
          body?.onsetDate !== undefined ? parseDate(body.onsetDate) : undefined,
        resolvedDate:
          body?.resolvedDate !== undefined
            ? parseDate(body.resolvedDate)
            : undefined,
      },
      select: {
        id: true,
        patientId: true,
        encounterId: true,
        code: true,
        description: true,
        status: true,
        onsetDate: true,
        resolvedDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ diagnosis });
  } catch (error) {
    console.error("Diagnosis PUT error:", error);
    return NextResponse.json(
      { error: "Unable to update diagnosis." },
      { status: 500 }
    );
  }
}

