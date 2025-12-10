import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type Params = Record<string, never>;
type RouteParams = { params: Params } | { params: Promise<Params> };

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toISO = (value: Date | null | undefined) =>
  value ? value.toISOString() : null;

const normalizeAppointment = (apt: any) => ({
  id: apt.id,
  patientId: apt.patientId,
  patientName: apt.patient
    ? `${apt.patient.firstName} ${apt.patient.lastName}`
    : null,
  status: apt.status,
  type: apt.type,
  startTime: toISO(apt.startTime),
  endTime: toISO(apt.endTime),
  notes: apt.notes ?? "",
  isRescheduled: Boolean(apt.isRescheduled),
  createdAt: toISO(apt.createdAt),
  updatedAt: toISO(apt.updatedAt),
});

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

export async function GET(request: NextRequest, _: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const statuses = statusFilter
      ? statusFilter.split(",").filter(Boolean)
      : null;

    const appointments = await prisma.appointment.findMany({
      where: statuses ? { status: { in: statuses as any } } : undefined,
      orderBy: [{ status: "asc" }, { startTime: "asc" }],
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      appointments: appointments.map(normalizeAppointment),
    });
  } catch (error) {
    console.error("Admin appointments GET error:", error);
    return NextResponse.json(
      { error: "Unable to fetch appointments." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, _: RouteParams) {
  try {
    const body = await request.json();
    const appointmentId = body?.id as string | undefined;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "id is required for update." },
        { status: 400 }
      );
    }

    const existing = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    const requestedStatus = body?.status ?? existing.status;
    const nextStatus =
      requestedStatus === "RESCHEDULED" ? "APPROVED" : requestedStatus;
    const start = body?.startTime
      ? parseDate(body.startTime)
      : existing.startTime;
    const end = body?.endTime ? parseDate(body.endTime) : existing.endTime;

    if (!start || !end || end <= start) {
      return NextResponse.json(
        { error: "Valid startTime and endTime are required." },
        { status: 400 }
      );
    }

    if (["APPROVED", "RESCHEDULED"].includes(nextStatus)) {
      const conflict = await hasConflict(start, end, appointmentId);
      if (conflict) {
        return NextResponse.json(
          { error: "Rescheduled time conflicts with an approved slot." },
          { status: 409 }
        );
      }
    }

    const isRescheduled =
      body?.isRescheduled ??
      ((existing.status !== nextStatus && nextStatus === "APPROVED") ||
        Boolean(body?.startTime || body?.endTime));

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: nextStatus,
        startTime: start,
        endTime: end,
        type: body?.type ?? undefined,
        notes: body?.notes ?? undefined,
        isRescheduled,
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ appointment: normalizeAppointment(updated) });
  } catch (error) {
    console.error("Admin appointments PUT error:", error);
    return NextResponse.json(
      { error: "Unable to update appointment." },
      { status: 500 }
    );
  }
}
