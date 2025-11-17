import PatientsPageClient from "./PatientsPageClient";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PatientsPage() {
  const patientProfiles = await prisma.patientProfile.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      phoneNumber: true,
      email: true,
    },
  });

  const patients = patientProfiles.map((profile) => ({
    id: profile.id,
    fullName: `${profile.firstName} ${profile.lastName}`.trim(),
    dateOfBirth: profile.dateOfBirth.toISOString().split("T")[0],
    phoneNumber: profile.phoneNumber,
    email: profile.email,
  }));

  return <PatientsPageClient patients={patients} />;
}
