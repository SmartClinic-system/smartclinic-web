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

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams = await resolveParams(params);
    const patientId = resolvedParams.patientId ?? body?.patientId ?? body?.id;

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    const {
      summary = "",
      primaryProvider = "",
      preferredPharmacy = "",
      lastReview = null,
    } = body ?? {};

    const lastReviewDate =
      typeof lastReview === "string" && lastReview.trim()
        ? parseDate(lastReview)
        : null;

    if (lastReview && !lastReviewDate) {
      return NextResponse.json(
        { error: "lastReview must be a valid date string when provided." },
        { status: 400 }
      );
    }

    const patientExists = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      select: { id: true },
    });

    if (!patientExists) {
      return NextResponse.json(
        { error: "Patient not found." },
        { status: 404 }
      );
    }

    const record = await prisma.electronicMedicalRecord.upsert({
      where: { patientId },
      create: {
        patientId,
        summary,
        primaryProvider,
        preferredPharmacy,
        lastReview: lastReviewDate,
      },
      update: {
        summary,
        primaryProvider,
        preferredPharmacy,
        lastReview: lastReviewDate,
      },
      select: {
        id: true,
        patientId: true,
        summary: true,
        primaryProvider: true,
        preferredPharmacy: true,
        lastReview: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      medicalRecord: {
        summary: record.summary ?? "",
        primaryProvider: record.primaryProvider ?? "",
        preferredPharmacy: record.preferredPharmacy ?? "",
        lastReview: record.lastReview ? record.lastReview.toISOString() : null,
      },
    });
  } catch (error) {
    console.error("Medical record PUT error:", error);
    return NextResponse.json(
      { error: "Unable to save medical record." },
      { status: 500 }
    );
  }
}
