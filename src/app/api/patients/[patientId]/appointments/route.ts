import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type Params = { patientId: string };
type RouteParams = { params: Params } | { params: Promise<Params> };

const resolveParams = async (params: RouteParams["params"]) => {
  if (params && typeof (params as Promise<any>).then === "function") {
    return (await (params as Promise<Params>)) ?? {};
  }
  return (params as Params) ?? {};
};

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toISO = (value: Date | null | undefined) =>
  value ? value.toISOString() : null;

const hasConflict = async (
  start: Date,
  end: Date,
  excludeId?: string
): Promise<boolean> => {
  const conflict = await prisma.appointment.findFirst({
    where: {
      id: excludeId ? { not: excludeId } : undefined,
      status: { in: ["APPROVED"] },
      startTime: { lt: end },
      endTime: { gt: start },
    },
    select: { id: true },
  });
  return Boolean(conflict);
};

const normalizeAppointment = (apt: any) => ({
  id: apt.id,
  patientId: apt.patientId,
  status: apt.status,
  type: apt.type,
  startTime: toISO(apt.startTime),
  endTime: toISO(apt.endTime),
  notes: apt.notes ?? "",
  isRescheduled: Boolean(apt.isRescheduled),
  createdAt: toISO(apt.createdAt),
  updatedAt: toISO(apt.updatedAt),
});

const resolvePatientId = async (patientId?: string | null) => {
  if (!patientId || patientId === "self" || patientId === "me") {
    const first = await prisma.patientProfile.findFirst({
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });
    return first?.id ?? null;
  }
  return patientId;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await resolveParams(params);
    const patientId = await resolvePatientId(resolvedParams.patientId);

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({
      appointments: appointments.map(normalizeAppointment),
    });
  } catch (error) {
    console.error("Appointments GET error:", error);
    return NextResponse.json(
      { error: "Unable to fetch appointments." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const resolvedParams = await resolveParams(params);
    const patientId = await resolvePatientId(
      resolvedParams.patientId ?? body?.patientId
    );

    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
      return NextResponse.json(
        { error: "patientId param is required." },
        { status: 400 }
      );
    }

    const start = parseDate(body?.startTime);
    if (!start) {
      return NextResponse.json(
        { error: "startTime is required and must be a valid date string." },
        { status: 400 }
      );
    }

    let end = parseDate(body?.endTime);
    if (!end) {
      end = new Date(start.getTime() + 30 * 60 * 1000);
    }

    if (end <= start) {
      return NextResponse.json(
        { error: "endTime must be after startTime." },
        { status: 400 }
      );
    }

    const conflict = await hasConflict(start, end);
    if (conflict) {
      return NextResponse.json(
        { error: "Appointment time conflicts with an approved slot." },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        status: "PENDING",
        type: body?.type ?? "CHECK_UP",
        startTime: start,
        endTime: end,
        notes: body?.notes ?? null,
      },
    });

    return NextResponse.json({
      appointment: normalizeAppointment(appointment),
    });
  } catch (error) {
    console.error("Appointment POST error:", error);
    return NextResponse.json(
      { error: "Unable to create appointment." },
      { status: 500 }
    );
  }
}
