import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PatientDetailPageClient, {
  type PatientDetailData,
} from "../PatientDetailPageClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patientDetailInclude = {
  medicalRecord: true,
  encounters: {
    orderBy: { startTime: "desc" as const },
    include: { diagnoses: true, treatmentPlans: true },
  },
  diagnoses: { orderBy: { createdAt: "desc" as const } },
  treatmentPlans: {
    orderBy: { createdAt: "desc" as const },
    include: { medicationOrders: true },
  },
  medicationOrders: { orderBy: { startDate: "desc" as const } },
  vitals: { orderBy: { recordedAt: "desc" as const } },
  labResults: { orderBy: { collectedAt: "desc" as const } },
  allergies: { orderBy: { notedAt: "desc" as const } },
} as const;

type PatientWithDetail = {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  phoneNumber: string;
  email: string;
  createdAt: Date;
  medicalRecord: {
    summary: string | null;
    primaryProvider: string | null;
    preferredPharmacy: string | null;
    lastReview: Date | null;
  } | null;
  encounters: Array<{
    id: string;
    medicalRecordId: string;
    type: string;
    status: string;
    reason: string | null;
    location: string | null;
    startTime: Date;
    endTime: Date | null;
    notes: string | null;
  }>;
  diagnoses: Array<{
    id: string;
    code: string;
    description: string | null;
    status: string;
    onsetDate: Date | null;
    resolvedDate: Date | null;
    createdAt: Date;
  }>;
  treatmentPlans: Array<{
    id: string;
    status: string;
    goal: string | null;
    startDate: Date | null;
    endDate: Date | null;
    notes: string | null;
    medicationOrders: Array<{
      id: string;
      medicationName: string;
      dosage: string | null;
      route: string;
      frequency: string | null;
      startDate: Date | null;
      endDate: Date | null;
    }>;
  }>;
  medicationOrders: Array<{
    id: string;
    medicationName: string;
    dosage: string | null;
    route: string;
    frequency: string | null;
    startDate: Date | null;
    endDate: Date | null;
  }>;
  vitals: Array<{
    id: string;
    type: string;
    value: number;
    unit: string;
    recordedAt: Date;
    recordedBy: string | null;
  }>;
  labResults: Array<{
    id: string;
    testName: string;
    status: string;
    resultValue: string | null;
    units: string | null;
    referenceRange: string | null;
    collectedAt: Date | null;
    resultedAt: Date | null;
    notes: string | null;
  }>;
  allergies: Array<{
    id: string;
    allergen: string;
    reaction: string | null;
    severity: string;
    isActive: boolean;
    notedAt: Date | null;
    notes: string | null;
  }>;
};

type PatientRouteParams = { patientId: string | string[] };

export default async function PatientDetailPage({
  params,
}: {
  params: PatientRouteParams | Promise<PatientRouteParams>;
}) {
  const resolvedParams = await params;
  const patientId = Array.isArray(resolvedParams.patientId)
    ? resolvedParams.patientId[0]
    : resolvedParams.patientId;

  if (!patientId) {
    notFound();
  }

  // Cast required because Prisma's generated types under Next.js bundler mode
  // don't yet expose the deeply nested include shape for EMR relations.
  const patient = (await prisma.patientProfile.findUnique({
    where: { id: patientId },
    include: patientDetailInclude,
  } as any)) as PatientWithDetail | null;

  if (!patient) {
    notFound();
  }

  const data = buildPatientDetailData(patient);

  return <PatientDetailPageClient data={data} />;
}

const toISO = (value?: Date | null) => (value ? value.toISOString() : null);

const calculateAge = (dob: Date) => {
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
};

function buildPatientDetailData(patient: PatientWithDetail): PatientDetailData {
  const profile = {
    id: patient.id,
    patientNumber: patient.patientId,
    firstName: patient.firstName,
    lastName: patient.lastName,
    fullName: `${patient.firstName} ${patient.lastName}`.trim(),
    initials: `${patient.firstName?.[0] ?? ""}${
      patient.lastName?.[0] ?? ""
    }`.toUpperCase(),
    dateOfBirth: toISO(patient.dateOfBirth) ?? "",
    age: calculateAge(patient.dateOfBirth),
    gender: patient.gender,
    phoneNumber: patient.phoneNumber,
    email: patient.email,
    createdAt: toISO(patient.createdAt) ?? "",
    medicalRecord: patient.medicalRecord
      ? {
          summary: patient.medicalRecord.summary ?? "",
          primaryProvider: patient.medicalRecord.primaryProvider ?? "",
          preferredPharmacy: patient.medicalRecord.preferredPharmacy ?? "",
          lastReview: toISO(patient.medicalRecord.lastReview),
        }
      : null,
  };

  const encounters = patient.encounters.map((encounter) => ({
    id: encounter.id,
    medicalRecordId: encounter.medicalRecordId,
    type: encounter.type,
    status: encounter.status,
    reason: encounter.reason ?? "General consultation",
    location: encounter.location ?? "In Clinic",
    startTime: toISO(encounter.startTime),
    endTime: toISO(encounter.endTime),
    notes: encounter.notes ?? "",
  }));

  const diagnoses = patient.diagnoses.map((diagnosis) => ({
    id: diagnosis.id,
    code: diagnosis.code,
    description: diagnosis.description ?? "",
    status: diagnosis.status,
    onsetDate: toISO(diagnosis.onsetDate),
    resolvedDate: toISO(diagnosis.resolvedDate),
    createdAt: toISO(diagnosis.createdAt),
  }));

  const treatmentPlans = patient.treatmentPlans.map((plan) => ({
    id: plan.id,
    status: plan.status,
    goal: plan.goal ?? "",
    startDate: toISO(plan.startDate),
    endDate: toISO(plan.endDate),
    notes: plan.notes ?? "",
    medications: plan.medicationOrders.map((med) => ({
      id: med.id,
      medicationName: med.medicationName,
      dosage: med.dosage ?? "",
      route: med.route,
      frequency: med.frequency ?? "",
      startDate: toISO(med.startDate),
      endDate: toISO(med.endDate),
    })),
  }));

  const medications = patient.medicationOrders.map((med) => ({
    id: med.id,
    medicationName: med.medicationName,
    dosage: med.dosage ?? "",
    route: med.route,
    frequency: med.frequency ?? "",
    startDate: toISO(med.startDate),
    endDate: toISO(med.endDate),
    status: med.endDate && med.endDate < new Date() ? "Completed" : "Active",
  }));

  const vitals = patient.vitals.map((vital) => ({
    id: vital.id,
    type: vital.type,
    value: vital.value,
    unit: vital.unit,
    recordedAt: toISO(vital.recordedAt),
    recordedBy: vital.recordedBy ?? "",
  }));

  const labResults = patient.labResults.map((lab) => ({
    id: lab.id,
    testName: lab.testName,
    status: lab.status,
    resultValue: lab.resultValue ?? "",
    units: lab.units ?? "",
    referenceRange: lab.referenceRange ?? "",
    collectedAt: toISO(lab.collectedAt),
    resultedAt: toISO(lab.resultedAt),
    notes: lab.notes ?? "",
  }));

  const allergies = patient.allergies.map((allergy) => ({
    id: allergy.id,
    allergen: allergy.allergen,
    reaction: allergy.reaction ?? "",
    severity: allergy.severity,
    isActive: allergy.isActive,
    notedAt: toISO(allergy.notedAt),
    notes: allergy.notes ?? "",
  }));

  const recentActivity = buildRecentActivity(patient);

  return {
    profile,
    encounters,
    diagnoses,
    treatmentPlans,
    medications,
    vitals,
    labResults,
    allergies,
    recentActivity,
  };
}

function buildRecentActivity(
  patient: PatientWithDetail
): PatientDetailData["recentActivity"] {
  type ActivityCandidate = {
    id: string;
    type: PatientDetailData["recentActivity"][number]["type"];
    title: string;
    description: string;
    date: Date | null;
  };

  const items: ActivityCandidate[] = [
    ...patient.encounters.map((enc) => ({
      id: `enc-${enc.id}`,
      type: "encounter" as const,
      title: `Appointment ${enc.status.toLowerCase()}`,
      description: enc.reason ?? "Visit recorded",
      date: enc.startTime,
    })),
    ...patient.labResults.map((lab) => ({
      id: `lab-${lab.id}`,
      type: "lab" as const,
      title: `Lab: ${lab.testName}`,
      description: lab.status,
      date: lab.resultedAt ?? lab.collectedAt ?? null,
    })),
    ...patient.diagnoses.map((dx) => ({
      id: `dx-${dx.id}`,
      type: "diagnosis" as const,
      title: `Diagnosis: ${dx.code}`,
      description: dx.description ?? dx.status,
      date: dx.onsetDate ?? dx.createdAt ?? null,
    })),
  ];

  return items
    .filter((item) => item.date)
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      date: item.date ? item.date.toISOString() : null,
    }));
}
