import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type Params = Record<string, never>;
type RouteParams = { params: Params } | { params: Promise<Params> };

const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

const formatAppointmentType = (type: string): string => {
  const typeMap: Record<string, string> = {
    CHECK_UP: "Check-up",
    CONSULTATION: "Consultation",
    FOLLOW_UP: "Follow-up",
    ANNUAL_PHYSICAL: "Annual Physical",
    TELEHEALTH: "Telehealth",
    URGENT: "Urgent",
  };
  return typeMap[type] || type;
};

const formatAppointmentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "Upcoming",
    APPROVED: "Upcoming",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  };
  return statusMap[status] || status;
};

export async function GET(_request: NextRequest, _: RouteParams) {
  try {
    // Get today's date range (start and end of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    // Get appointments for today
    const todaysAppointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: today,
          lte: todayEnd,
        },
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Count appointments for today
    const appointmentsTodayCount = todaysAppointments.length;

    // Get date for 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Get new patients from the last 7 days
    const newPatientsThisWeek = await prisma.patientProfile.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const newPatientsThisWeekCount = newPatientsThisWeek.length;

    // Format appointments for today
    const formattedAppointments = todaysAppointments.map((apt) => ({
      id: apt.id,
      name: `${apt.patient.firstName} ${apt.patient.lastName}`,
      time: formatTime(apt.startTime),
      type: formatAppointmentType(apt.type),
      status: formatAppointmentStatus(apt.status),
      originalStatus: apt.status,
    }));

    // Format new patients
    const formattedPatients = newPatientsThisWeek.map((patient) => ({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
    }));

    return NextResponse.json({
      appointmentsTodayCount,
      newPatientsThisWeekCount,
      todaysAppointments: formattedAppointments,
      newPatientsThisWeek: formattedPatients,
    });
  } catch (error) {
    console.error("Admin dashboard GET error:", error);
    return NextResponse.json(
      { error: "Unable to fetch dashboard data." },
      { status: 500 }
    );
  }
}
