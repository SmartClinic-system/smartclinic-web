"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  ContactPhone,
  Email,
  Home,
  LocalHospital,
  Medication,
  MonitorHeart,
  NoteAdd,
  Science,
  Search,
  WarningAmber,
} from "@mui/icons-material";

export interface PatientDetailData {
  profile: ProfileData;
  allergies: AllergyData[];
  recentActivity: ActivityItem[];
  encounters: EncounterData[];
  diagnoses: DiagnosisData[];
  treatmentPlans: TreatmentPlanData[];
  medications: MedicationData[];
  labResults: LabResultData[];
  vitals: VitalData[];
}

interface ProfileData {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  medicalRecord: {
    summary: string;
    primaryProvider: string;
    preferredPharmacy: string;
    lastReview: string | null;
  } | null;
}

interface AllergyData {
  id: string;
  medicalRecordId: string;
  allergen: string;
  reaction: string;
  severity: string;
  isActive: boolean;
  notedAt: string | null;
  notes: string;
}

interface ActivityItem {
  id: string;
  type: "encounter" | "lab" | "diagnosis";
  title: string;
  description: string;
  date: string | null;
}

interface EncounterData {
  id: string;
  medicalRecordId?: string;
  type: string;
  status: string;
  reason: string;
  location: string;
  startTime: string | null;
  endTime: string | null;
  notes: string;
}

interface DiagnosisData {
  id: string;
  code: string;
  description: string;
  status: string;
  onsetDate: string | null;
  resolvedDate: string | null;
  createdAt: string | null;
}

interface TreatmentPlanData {
  id: string;
  status: string;
  goal: string;
  startDate: string | null;
  endDate: string | null;
  notes: string;
  medications: Array<{
    id: string;
    medicationName: string;
    dosage: string;
    route: string;
    frequency: string;
    startDate: string | null;
    endDate: string | null;
  }>;
}

interface MedicationData {
  id: string;
  treatmentPlanId: string | null;
  medicationName: string;
  dosage: string;
  route: string;
  frequency: string;
  startDate: string | null;
  endDate: string | null;
  prescribingProvider: string;
  instructions: string;
  status: string;
}

interface LabResultData {
  id: string;
  testName: string;
  status: string;
  resultValue: string;
  units: string;
  referenceRange: string;
  collectedAt: string | null;
  resultedAt: string | null;
  orderingProvider: string;
  notes: string;
}

interface VitalData {
  id: string;
  type: string;
  value: number;
  unit: string;
  recordedAt: string | null;
  recordedBy: string;
}

type PatientFormState = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
};

type EmrFormState = {
  summary: string;
  primaryProvider: string;
  preferredPharmacy: string;
  lastReview: string;
};

type FeedbackState = { type: "success" | "error"; message: string } | null;

type EncounterFormState = {
  id: string;
  type: string;
  status: string;
  reason: string;
  location: string;
  startTime: string;
  endTime: string;
  notes: string;
};

type DiagnosisFormState = {
  id: string;
  encounterId: string;
  code: string;
  description: string;
  status: string;
  onsetDate: string;
  resolvedDate: string;
};

type TreatmentPlanFormState = {
  id: string;
  encounterId: string;
  diagnosisId: string;
  status: string;
  goal: string;
  startDate: string;
  endDate: string;
  notes: string;
};

type MedicationFormState = {
  id: string;
  treatmentPlanId: string;
  medicationName: string;
  dosage: string;
  route: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribingProvider: string;
  instructions: string;
};

type VitalFormState = {
  id: string;
  type: string;
  value: string;
  unit: string;
  recordedAt: string;
  recordedBy: string;
};

type LabFormState = {
  id: string;
  testName: string;
  status: string;
  resultValue: string;
  units: string;
  referenceRange: string;
  collectedAt: string;
  resultedAt: string;
  orderingProvider: string;
  notes: string;
};

type AllergyFormState = {
  id: string;
  allergen: string;
  reaction: string;
  severity: string;
  isActive: boolean;
  notedAt: string;
  notes: string;
};

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Diagnoses", value: "diagnoses" },
  { label: "Treatments", value: "treatments" },
  { label: "Appointments", value: "encounters" },
  { label: "Lab Results", value: "labs" },
  { label: "Medications", value: "medications" },
  { label: "Vitals", value: "vitals" },
  { label: "Notes", value: "notes" },
] as const;

type TabValue = (typeof tabs)[number]["value"];

const editTabs = [
  { label: "Encounters", value: "encounters" },
  { label: "Diagnoses", value: "diagnoses" },
  { label: "Treatments", value: "treatmentPlans" },
  { label: "Medications", value: "medications" },
  { label: "Vitals", value: "vitals" },
  { label: "Labs", value: "labs" },
  { label: "Allergies", value: "allergies" },
] as const;

type EditTabValue = (typeof editTabs)[number]["value"];

const ENCOUNTER_TYPES = [
  "ROUTINE",
  "FOLLOW_UP",
  "EMERGENCY",
  "TELEHEALTH",
  "INPATIENT",
  "OUTPATIENT",
] as const;

const ENCOUNTER_STATUSES = [
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

const DIAGNOSIS_STATUSES = [
  "ACTIVE",
  "CHRONIC",
  "RESOLVED",
  "RULED_OUT",
] as const;

const TREATMENT_STATUSES = [
  "PLANNED",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
] as const;

const MEDICATION_ROUTES = [
  "ORAL",
  "INTRAVENOUS",
  "INTRAMUSCULAR",
  "SUBCUTANEOUS",
  "TOPICAL",
  "INHALATION",
  "OTHER",
] as const;

const LAB_STATUSES = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "ABNORMAL",
  "CANCELLED",
] as const;

const SEVERITY_LEVELS = [
  "MILD",
  "MODERATE",
  "SEVERE",
  "LIFE_THREATENING",
] as const;

const VITAL_TYPES = [
  "HEART_RATE",
  "BLOOD_PRESSURE_SYSTOLIC",
  "BLOOD_PRESSURE_DIASTOLIC",
  "RESPIRATION_RATE",
  "TEMPERATURE",
  "OXYGEN_SATURATION",
  "BLOOD_GLUCOSE",
  "WEIGHT",
  "HEIGHT",
] as const;

export default function PatientDetailPageClient({
  data,
}: {
  data: PatientDetailData;
}) {
  const [activeTab, setActiveTab] = useState<TabValue>("overview");
  const [searchValue, setSearchValue] = useState("");
  const [profile, setProfile] = useState<ProfileData>(data.profile);
  const [medicalRecord, setMedicalRecord] = useState<
    ProfileData["medicalRecord"]
  >(data.profile.medicalRecord);
  const [encounters, setEncounters] = useState<EncounterData[]>(
    data.encounters
  );
  const [diagnoses, setDiagnoses] = useState<DiagnosisData[]>(data.diagnoses);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlanData[]>(
    data.treatmentPlans
  );
  const [medications, setMedications] = useState<MedicationData[]>(
    data.medications
  );
  const [vitals, setVitals] = useState<VitalData[]>(data.vitals);
  const [labResults, setLabResults] = useState<LabResultData[]>(
    data.labResults
  );
  const [allergies, setAllergies] = useState<AllergyData[]>(data.allergies);
  const profileForView = { ...profile, medicalRecord: medicalRecord ?? null };
  const [editOpen, setEditOpen] = useState(false);
  const [patientForm, setPatientForm] = useState<PatientFormState>(() =>
    toPatientForm(profileForView)
  );
  const [emrForm, setEmrForm] = useState<EmrFormState>(() =>
    toEmrForm(profileForView.medicalRecord)
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmr, setSavingEmr] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [recordTab, setRecordTab] = useState<EditTabValue>("encounters");
  const [encounterForm, setEncounterForm] = useState<EncounterFormState>(() =>
    newEncounterForm()
  );
  const [diagnosisForm, setDiagnosisForm] = useState<DiagnosisFormState>(() =>
    newDiagnosisForm()
  );
  const [treatmentPlanForm, setTreatmentPlanForm] =
    useState<TreatmentPlanFormState>(() => newTreatmentPlanForm());
  const [medicationForm, setMedicationForm] = useState<MedicationFormState>(
    () => newMedicationForm()
  );
  const [vitalForm, setVitalForm] = useState<VitalFormState>(() =>
    newVitalForm()
  );
  const [labForm, setLabForm] = useState<LabFormState>(() => newLabForm());
  const [allergyForm, setAllergyForm] = useState<AllergyFormState>(() =>
    newAllergyForm()
  );
  const [savingRecord, setSavingRecord] = useState<EditTabValue | null>(null);

  const searchQuery = searchValue.trim().toLowerCase();
  const applySearch = <T,>(
    rows: T[],
    pick: (row: T) => Array<string | null | undefined>
  ) => {
    if (!searchQuery) return rows;
    return rows.filter((row) =>
      pick(row).some((value) => value?.toLowerCase().includes(searchQuery))
    );
  };

  const activeMedications = useMemo(
    () => medications.filter((med) => med.status === "Active"),
    [medications]
  );

  const allergyBadges = allergies.filter((allergy) => allergy.isActive);

  const overviewPinnedNotes =
    profileForView.medicalRecord?.summary?.trim() || "No notes available yet.";

  const handleOpenEdit = () => {
    setPatientForm(toPatientForm(profileForView));
    setEmrForm(toEmrForm(profileForView.medicalRecord));
    setEditOpen(true);
  };

  const handleCloseEdit = () => setEditOpen(false);

  const handleProfileSave = async () => {
    setSavingProfile(true);
    setFeedback(null);
    try {
      const response = await fetch(
        `/api/patients/${profileForView.id}/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...patientForm,
            dateOfBirth: patientForm.dateOfBirth,
          }),
        }
      );

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to update patient info.");
      }

      const updated = payload.profile as ProfileData;
      const nextProfile: ProfileData = {
        ...profileForView,
        ...updated,
        age: getAgeFromIso(updated.dateOfBirth),
        medicalRecord: updated.medicalRecord ?? profileForView.medicalRecord,
      };

      setProfile(nextProfile);
      setMedicalRecord(nextProfile.medicalRecord);
      setFeedback({ type: "success", message: "Patient info updated." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update patient info.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEmrSave = async () => {
    setSavingEmr(true);
    setFeedback(null);
    try {
      const response = await fetch(
        `/api/patients/${profileForView.id}/medical-record`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...emrForm,
            lastReview: emrForm.lastReview || null,
          }),
        }
      );

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save medical record.");
      }

      const nextMedicalRecord = payload.medicalRecord as
        | ProfileData["medicalRecord"]
        | undefined;

      setMedicalRecord(nextMedicalRecord ?? null);
      setProfile((prev) => ({
        ...prev,
        medicalRecord: nextMedicalRecord ?? null,
      }));
      setFeedback({ type: "success", message: "EMR saved." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save medical record.",
      });
    } finally {
      setSavingEmr(false);
    }
  };

  const closeFeedback = () => setFeedback(null);

  const handleOpenRecords = (tab?: EditTabValue) => {
    if (tab) setRecordTab(tab);
    setRecordsOpen(true);
  };
  const handleCloseRecords = () => setRecordsOpen(false);

  const handleSelectEncounter = (id: string) => {
    const match = encounters.find((item) => item.id === id);
    setEncounterForm(newEncounterForm(match));
  };

  const handleSelectDiagnosis = (id: string) => {
    const match = diagnoses.find((item) => item.id === id);
    setDiagnosisForm(newDiagnosisForm(match));
  };

  const handleSelectTreatmentPlan = (id: string) => {
    const match = treatmentPlans.find((item) => item.id === id);
    setTreatmentPlanForm(newTreatmentPlanForm(match));
  };

  const handleSelectMedication = (id: string) => {
    const match = medications.find((item) => item.id === id);
    setMedicationForm(newMedicationForm(match));
  };

  const handleSelectVital = (id: string) => {
    const match = vitals.find((item) => item.id === id);
    setVitalForm(newVitalForm(match));
  };

  const handleSelectLab = (id: string) => {
    const match = labResults.find((item) => item.id === id);
    setLabForm(newLabForm(match));
  };

  const handleSelectAllergy = (id: string) => {
    const match = allergies.find((item) => item.id === id);
    setAllergyForm(newAllergyForm(match));
  };

  const onEncounterFieldChange = (
    field: keyof EncounterFormState,
    value: string
  ) => setEncounterForm((prev) => ({ ...prev, [field]: value }));

  const onDiagnosisFieldChange = (
    field: keyof DiagnosisFormState,
    value: string
  ) => setDiagnosisForm((prev) => ({ ...prev, [field]: value }));

  const onTreatmentPlanFieldChange = (
    field: keyof TreatmentPlanFormState,
    value: string
  ) => setTreatmentPlanForm((prev) => ({ ...prev, [field]: value }));

  const onMedicationFieldChange = (
    field: keyof MedicationFormState,
    value: string
  ) => setMedicationForm((prev) => ({ ...prev, [field]: value }));

  const onVitalFieldChange = (field: keyof VitalFormState, value: string) =>
    setVitalForm((prev) => ({ ...prev, [field]: value }));

  const onLabFieldChange = (field: keyof LabFormState, value: string) =>
    setLabForm((prev) => ({ ...prev, [field]: value }));

  const onAllergyFieldChange = (
    field: keyof AllergyFormState,
    value: string | boolean
  ) =>
    setAllergyForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  const upsertTreatmentPlanWithMeds = (plan: TreatmentPlanData) =>
    setTreatmentPlans((prev) => {
      const existing = prev.find((p) => p.id === plan.id);
      const merged: TreatmentPlanData = {
        ...plan,
        medications: existing?.medications ?? plan.medications ?? [],
      };
      return upsertById(prev, merged);
    });

  const saveEncounter = async () => {
    if (!encounterForm.startTime) {
      setFeedback({
        type: "error",
        message: "Start time is required for encounters.",
      });
      return;
    }
    setSavingRecord("encounters");
    setFeedback(null);
    try {
      const method = encounterForm.id ? "PUT" : "POST";
      const response = await fetch(
        `/api/patients/${profileForView.id}/encounters`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...encounterForm,
            patientId: profileForView.id,
          }),
        }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save encounter.");
      }
      const normalized = normalizeEncounter(payload.encounter);
      setEncounters((prev) => upsertById(prev, normalized));
      setEncounterForm(newEncounterForm(normalized));
      setFeedback({ type: "success", message: "Encounter saved." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to save encounter.",
      });
    } finally {
      setSavingRecord(null);
    }
  };

  const saveDiagnosis = async () => {
    if (!diagnosisForm.code) {
      setFeedback({
        type: "error",
        message: "Code is required for diagnoses.",
      });
      return;
    }
    setSavingRecord("diagnoses");
    setFeedback(null);
    try {
      const method = diagnosisForm.id ? "PUT" : "POST";
      const response = await fetch(
        `/api/patients/${profileForView.id}/diagnoses`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...diagnosisForm,
            patientId: profileForView.id,
          }),
        }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save diagnosis.");
      }
      const normalized = normalizeDiagnosis(payload.diagnosis);
      setDiagnoses((prev) => upsertById(prev, normalized));
      setDiagnosisForm(newDiagnosisForm(normalized));
      setFeedback({ type: "success", message: "Diagnosis saved." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to save diagnosis.",
      });
    } finally {
      setSavingRecord(null);
    }
  };

  const saveTreatmentPlan = async () => {
    setSavingRecord("treatmentPlans");
    setFeedback(null);
    try {
      const method = treatmentPlanForm.id ? "PUT" : "POST";
      const response = await fetch(
        `/api/patients/${profileForView.id}/treatment-plans`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...treatmentPlanForm,
            patientId: profileForView.id,
          }),
        }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save treatment plan.");
      }
      const normalized = normalizeTreatmentPlan(payload.treatmentPlan);
      upsertTreatmentPlanWithMeds(normalized);
      setTreatmentPlanForm(newTreatmentPlanForm(normalized));
      setFeedback({ type: "success", message: "Treatment plan saved." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save treatment plan.",
      });
    } finally {
      setSavingRecord(null);
    }
  };

  const saveMedication = async () => {
    if (!medicationForm.medicationName) {
      setFeedback({
        type: "error",
        message: "Medication name is required.",
      });
      return;
    }
    setSavingRecord("medications");
    setFeedback(null);
    try {
      const method = medicationForm.id ? "PUT" : "POST";
      const response = await fetch(
        `/api/patients/${profileForView.id}/medications`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...medicationForm,
            patientId: profileForView.id,
          }),
        }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save medication.");
      }
      const normalized = normalizeMedication(payload.medicationOrder);
      setMedications((prev) => upsertById(prev, normalized));
      setMedicationForm(newMedicationForm(normalized));
      setFeedback({ type: "success", message: "Medication saved." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to save medication.",
      });
    } finally {
      setSavingRecord(null);
    }
  };

  const saveVital = async () => {
    if (!vitalForm.type || !vitalForm.value) {
      setFeedback({
        type: "error",
        message: "Type and value are required for vitals.",
      });
      return;
    }
    setSavingRecord("vitals");
    setFeedback(null);
    try {
      const method = vitalForm.id ? "PUT" : "POST";
      const response = await fetch(
        `/api/patients/${profileForView.id}/vitals`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...vitalForm,
            value: Number(vitalForm.value),
            patientId: profileForView.id,
          }),
        }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save vital.");
      }
      const normalized = normalizeVital(payload.vitalSign);
      setVitals((prev) => upsertById(prev, normalized));
      setVitalForm(newVitalForm(normalized));
      setFeedback({ type: "success", message: "Vital saved." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to save vital.",
      });
    } finally {
      setSavingRecord(null);
    }
  };

  const saveLab = async () => {
    if (!labForm.testName) {
      setFeedback({
        type: "error",
        message: "Test name is required for labs.",
      });
      return;
    }
    setSavingRecord("labs");
    setFeedback(null);
    try {
      const method = labForm.id ? "PUT" : "POST";
      const response = await fetch(`/api/patients/${profileForView.id}/labs`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...labForm,
          patientId: profileForView.id,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save lab result.");
      }
      const normalized = normalizeLab(payload.labResult);
      setLabResults((prev) => upsertById(prev, normalized));
      setLabForm(newLabForm(normalized));
      setFeedback({ type: "success", message: "Lab result saved." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to save lab result.",
      });
    } finally {
      setSavingRecord(null);
    }
  };

  const saveAllergy = async () => {
    if (!allergyForm.allergen) {
      setFeedback({
        type: "error",
        message: "Allergen is required for allergies.",
      });
      return;
    }
    setSavingRecord("allergies");
    setFeedback(null);
    try {
      const method = allergyForm.id ? "PUT" : "POST";
      const response = await fetch(
        `/api/patients/${profileForView.id}/allergies`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...allergyForm,
            patientId: profileForView.id,
          }),
        }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save allergy.");
      }
      const normalized = normalizeAllergy(payload.allergy);
      setAllergies((prev) => upsertById(prev, normalized));
      setAllergyForm(newAllergyForm(normalized));
      setFeedback({ type: "success", message: "Allergy saved." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to save allergy.",
      });
    } finally {
      setSavingRecord(null);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            recentActivity={data.recentActivity}
            activeMedications={activeMedications}
            allergies={allergyBadges}
            profile={profileForView}
            pinnedNotes={overviewPinnedNotes}
          />
        );
      case "diagnoses":
        return (
          <DataTableCard
            title="Diagnoses"
            rows={applySearch(diagnoses, (row) => [
              row.code,
              row.description,
              row.status,
            ])}
            columns={[
              {
                label: "Code",
                render: (row: DiagnosisData) => row.code,
              },
              {
                label: "Description",
                render: (row: DiagnosisData) => row.description || "—",
              },
              {
                label: "Status",
                render: (row: DiagnosisData) => (
                  <Chip label={formatLabel(row.status)} size="small" />
                ),
              },
              {
                label: "Onset",
                render: (row: DiagnosisData) => formatDate(row.onsetDate),
              },
              {
                label: "Resolved",
                render: (row: DiagnosisData) => formatDate(row.resolvedDate),
              },
            ]}
            emptyMessage="No diagnoses recorded."
          />
        );
      case "treatments":
        return (
          <DataTableCard
            title="Treatment Plans"
            rows={applySearch(treatmentPlans, (row) => [row.goal, row.status])}
            columns={[
              {
                label: "Goal",
                render: (row: TreatmentPlanData) => row.goal || "—",
              },
              {
                label: "Status",
                render: (row: TreatmentPlanData) => (
                  <Chip label={formatLabel(row.status)} size="small" />
                ),
              },
              {
                label: "Start",
                render: (row: TreatmentPlanData) => formatDate(row.startDate),
              },
              {
                label: "End",
                render: (row: TreatmentPlanData) => formatDate(row.endDate),
              },
              {
                label: "Medications",
                render: (row: TreatmentPlanData) =>
                  row.medications.length
                    ? row.medications
                        .map((med) => med.medicationName)
                        .join(", ")
                    : "—",
              },
            ]}
            emptyMessage="No treatment plans recorded."
          />
        );
      case "encounters":
        return (
          <DataTableCard
            title="Appointments & Encounters"
            rows={applySearch(encounters, (row) => [
              row.reason,
              row.status,
              row.type,
              row.location,
            ])}
            columns={[
              {
                label: "Type",
                render: (row: EncounterData) => formatLabel(row.type),
              },
              {
                label: "Status",
                render: (row: EncounterData) => (
                  <Chip label={formatLabel(row.status)} size="small" />
                ),
              },
              {
                label: "Reason",
                render: (row: EncounterData) => row.reason,
              },
              {
                label: "Schedule",
                render: (row: EncounterData) =>
                  formatDateTimeRange(row.startTime, row.endTime),
              },
              {
                label: "Location",
                render: (row: EncounterData) => row.location,
              },
            ]}
            emptyMessage="No encounters recorded."
          />
        );
      case "labs":
        return (
          <DataTableCard
            title="Lab Results"
            rows={applySearch(labResults, (row) => [
              row.testName,
              row.status,
              row.resultValue,
            ])}
            columns={[
              {
                label: "Test",
                render: (row: LabResultData) => row.testName,
              },
              {
                label: "Status",
                render: (row: LabResultData) => (
                  <Chip label={formatLabel(row.status)} size="small" />
                ),
              },
              {
                label: "Result",
                render: (row: LabResultData) =>
                  row.resultValue
                    ? `${row.resultValue} ${row.units}`.trim()
                    : "Pending",
              },
              {
                label: "Collected",
                render: (row: LabResultData) => formatDate(row.collectedAt),
              },
              {
                label: "Reference",
                render: (row: LabResultData) => row.referenceRange || "—",
              },
            ]}
            emptyMessage="No lab results recorded."
          />
        );
      case "medications":
        return (
          <DataTableCard
            title="Medication Orders"
            rows={applySearch(medications, (row) => [
              row.medicationName,
              row.status,
              row.frequency,
            ])}
            columns={[
              {
                label: "Medication",
                render: (row: MedicationData) => row.medicationName,
              },
              {
                label: "Dosage",
                render: (row: MedicationData) => row.dosage || "—",
              },
              {
                label: "Route",
                render: (row: MedicationData) => formatLabel(row.route),
              },
              {
                label: "Frequency",
                render: (row: MedicationData) => row.frequency || "—",
              },
              {
                label: "Status",
                render: (row: MedicationData) => (
                  <Chip label={row.status} size="small" color="primary" />
                ),
              },
              {
                label: "Start",
                render: (row: MedicationData) => formatDate(row.startDate),
              },
              {
                label: "End",
                render: (row: MedicationData) => formatDate(row.endDate),
              },
            ]}
            emptyMessage="No medication orders recorded."
          />
        );
      case "vitals":
        return (
          <DataTableCard
            title="Vitals"
            rows={applySearch(vitals, (row) => [
              row.type,
              row.recordedBy,
              String(row.value),
            ])}
            columns={[
              {
                label: "Type",
                render: (row: VitalData) => formatLabel(row.type),
              },
              {
                label: "Value",
                render: (row: VitalData) => `${row.value} ${row.unit}`,
              },
              {
                label: "Recorded By",
                render: (row: VitalData) => row.recordedBy || "—",
              },
              {
                label: "Recorded At",
                render: (row: VitalData) => formatDateTime(row.recordedAt),
              },
            ]}
            emptyMessage="No vitals recorded."
          />
        );
      case "notes":
        return (
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Notes
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>
              Notes syncing is coming soon. In the meantime, keep track of
              updates inside the patient summary so the team stays aligned.
            </Typography>
            <Button variant="outlined" startIcon={<NoteAdd />}>
              Add Note
            </Button>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: "1280px", mx: "auto", py: 4, px: { xs: 2, md: 0 } }}>
      <HeaderCard
        profile={profileForView}
        allergies={allergyBadges}
        onEdit={handleOpenEdit}
        onManageRecords={() => handleOpenRecords()}
      />

      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          mt: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: { xs: 1, md: 3 },
            borderBottom: "1px solid",
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ p: { xs: 2, md: 3 } }}>{renderTabContent()}</Box>
      </Card>

      <EditInfoDialog
        open={editOpen}
        onClose={handleCloseEdit}
        patientForm={patientForm}
        emrForm={emrForm}
        onPatientChange={(key, value) =>
          setPatientForm((prev) => ({ ...prev, [key]: value }))
        }
        onEmrChange={(key, value) =>
          setEmrForm((prev) => ({ ...prev, [key]: value }))
        }
        onSavePatient={handleProfileSave}
        onSaveEmr={handleEmrSave}
        savingProfile={savingProfile}
        savingEmr={savingEmr}
      />

      <RecordsDialog
        open={recordsOpen}
        tab={recordTab}
        onTabChange={(value) => setRecordTab(value)}
        onClose={handleCloseRecords}
        encounters={encounters}
        diagnoses={diagnoses}
        treatmentPlans={treatmentPlans}
        medications={medications}
        vitals={vitals}
        labResults={labResults}
        allergies={allergies}
        encounterForm={encounterForm}
        diagnosisForm={diagnosisForm}
        treatmentPlanForm={treatmentPlanForm}
        medicationForm={medicationForm}
        vitalForm={vitalForm}
        labForm={labForm}
        allergyForm={allergyForm}
        onSelectEncounter={handleSelectEncounter}
        onSelectDiagnosis={handleSelectDiagnosis}
        onSelectTreatmentPlan={handleSelectTreatmentPlan}
        onSelectMedication={handleSelectMedication}
        onSelectVital={handleSelectVital}
        onSelectLab={handleSelectLab}
        onSelectAllergy={handleSelectAllergy}
        onEncounterChange={onEncounterFieldChange}
        onDiagnosisChange={onDiagnosisFieldChange}
        onTreatmentPlanChange={onTreatmentPlanFieldChange}
        onMedicationChange={onMedicationFieldChange}
        onVitalChange={onVitalFieldChange}
        onLabChange={onLabFieldChange}
        onAllergyChange={onAllergyFieldChange}
        onSaveEncounter={saveEncounter}
        onSaveDiagnosis={saveDiagnosis}
        onSaveTreatmentPlan={saveTreatmentPlan}
        onSaveMedication={saveMedication}
        onSaveVital={saveVital}
        onSaveLab={saveLab}
        onSaveAllergy={saveAllergy}
        saving={savingRecord}
      />

      {feedback && (
        <Snackbar
          open
          autoHideDuration={4000}
          onClose={closeFeedback}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={closeFeedback}
            severity={feedback.type}
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

function HeaderCard({
  profile,
  allergies,
  onEdit,
  onManageRecords,
}: {
  profile: ProfileData;
  allergies: AllergyData[];
  onEdit: () => void;
  onManageRecords: () => void;
}) {
  const allergyLabel =
    allergies.length === 0
      ? "No recorded allergies"
      : `${allergies[0].allergen}${
          allergies.length > 1 ? ` +${allergies.length - 1}` : ""
        }`;

  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: "divider",
        p: { xs: 2.5, md: 3.5 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        alignItems: { md: "center" },
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Avatar
          sx={{
            width: 96,
            height: 96,
            fontSize: "2.5rem",
            bgcolor: "primary.main",
          }}
        >
          {profile.initials || "PT"}
        </Avatar>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            {profile.fullName}
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
            DOB: {formatDate(profile.dateOfBirth)} · Age: {profile.age} · ID:{" "}
            {profile.patientNumber}
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
            <Chip
              icon={<WarningAmber />}
              label={allergyLabel}
              color={allergies.length ? "error" : "default"}
              variant={allergies.length ? "filled" : "outlined"}
              size="small"
            />
            {profile.medicalRecord?.primaryProvider ? (
              <Chip
                label={`Provider · ${profile.medicalRecord.primaryProvider}`}
                size="small"
                variant="outlined"
              />
            ) : null}
          </Stack>
        </Box>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button variant="outlined" onClick={onEdit}>
          Edit Info
        </Button>
        <Button variant="outlined" onClick={onManageRecords}>
          Manage Records
        </Button>
        <Button variant="contained">Book Appointment</Button>
      </Stack>
    </Card>
  );
}

function OverviewTab({
  recentActivity,
  activeMedications,
  allergies,
  profile,
  pinnedNotes,
}: {
  recentActivity: ActivityItem[];
  activeMedications: MedicationData[];
  allergies: AllergyData[];
  profile: ProfileData;
  pinnedNotes: string;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
        gap: 3,
      }}
    >
      <Box>
        <SectionCard title="Recent Activity">
          {recentActivity.length ? (
            <Stack spacing={2}>
              {recentActivity.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </Stack>
          ) : (
            <EmptyState message="No recent activity to show yet." />
          )}
        </SectionCard>

        <SectionCard title="Active Medications">
          {activeMedications.length ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Medication</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Start Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeMedications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {med.medicationName}
                    </TableCell>
                    <TableCell>{med.dosage || "—"}</TableCell>
                    <TableCell>{med.frequency || "—"}</TableCell>
                    <TableCell>{formatDate(med.startDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState message="No active medications." />
          )}
        </SectionCard>
      </Box>

      <Box>
        <SectionCard title="Contact & Demographics">
          <InfoList
            items={[
              {
                icon: <ContactPhone fontSize="small" />,
                label: "Phone",
                value: profile.phoneNumber,
              },
              {
                icon: <Email fontSize="small" />,
                label: "Email",
                value: profile.email,
              },
              {
                icon: <Home fontSize="small" />,
                label: "Address",
                value: "Not provided",
              },
              {
                icon: <MonitorHeart fontSize="small" />,
                label: "Gender",
                value: profile.gender,
              },
            ]}
          />
        </SectionCard>

        <SectionCard title="Allergies">
          {allergies.length ? (
            <Stack spacing={1.5}>
              {allergies.map((allergy) => (
                <Box
                  key={allergy.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "error.light",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {allergy.allergen}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                      {allergy.reaction || "Reaction not noted"}
                    </Typography>
                  </Box>
                  <Chip
                    label={formatLabel(allergy.severity)}
                    color="error"
                    size="small"
                  />
                </Box>
              ))}
            </Stack>
          ) : (
            <EmptyState message="No recorded allergies." />
          )}
        </SectionCard>

        <SectionCard title="Pinned Notes">
          <Typography sx={{ color: "text.primary" }}>{pinnedNotes}</Typography>
        </SectionCard>
      </Box>
    </Box>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: "divider",
        p: 2.5,
        mb: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Card>
  );
}

interface InfoListProps {
  items: Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
  }>;
}

function InfoList({ items }: InfoListProps) {
  return (
    <Stack spacing={1.5}>
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: "action.hover",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
            }}
          >
            {item.icon}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {item.label}
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
              {item.value || "—"}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const icon = {
    encounter: <LocalHospital fontSize="small" />,
    lab: <Science fontSize="small" />,
    diagnosis: <Medication fontSize="small" />,
  }[item.type];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        p: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: "primary.light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
          {item.description}
        </Typography>
      </Box>
      <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
        {formatDate(item.date)}
      </Typography>
    </Box>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Box
      sx={{
        py: 4,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      {message}
    </Box>
  );
}

function EditInfoDialog({
  open,
  onClose,
  patientForm,
  emrForm,
  onPatientChange,
  onEmrChange,
  onSavePatient,
  onSaveEmr,
  savingProfile,
  savingEmr,
}: {
  open: boolean;
  onClose: () => void;
  patientForm: PatientFormState;
  emrForm: EmrFormState;
  onPatientChange: (field: keyof PatientFormState, value: string) => void;
  onEmrChange: (field: keyof EmrFormState, value: string) => void;
  onSavePatient: () => Promise<void> | void;
  onSaveEmr: () => Promise<void> | void;
  savingProfile: boolean;
  savingEmr: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Patient & EMR</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ sm: "center" }}
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Patient Information
              </Typography>
              <Button
                variant="contained"
                onClick={onSavePatient}
                disabled={savingProfile}
                startIcon={
                  savingProfile ? <CircularProgress size={18} /> : undefined
                }
              >
                Save Patient
              </Button>
            </Stack>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={patientForm.firstName}
                  onChange={(event) =>
                    onPatientChange("firstName", event.target.value)
                  }
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={patientForm.lastName}
                  onChange={(event) =>
                    onPatientChange("lastName", event.target.value)
                  }
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={patientForm.dateOfBirth}
                  onChange={(event) =>
                    onPatientChange("dateOfBirth", event.target.value)
                  }
                />
                <TextField
                  fullWidth
                  label="Gender"
                  select
                  value={patientForm.gender}
                  onChange={(event) =>
                    onPatientChange("gender", event.target.value)
                  }
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Non-binary">Non-binary</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={patientForm.phoneNumber}
                  onChange={(event) =>
                    onPatientChange("phoneNumber", event.target.value)
                  }
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={patientForm.email}
                  onChange={(event) =>
                    onPatientChange("email", event.target.value)
                  }
                />
              </Stack>
            </Stack>
          </Card>

          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ sm: "center" }}
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                EMR
              </Typography>
              <Button
                variant="contained"
                onClick={onSaveEmr}
                disabled={savingEmr}
                startIcon={
                  savingEmr ? <CircularProgress size={18} /> : undefined
                }
              >
                Save EMR
              </Button>
            </Stack>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Summary"
                multiline
                minRows={3}
                value={emrForm.summary}
                onChange={(event) => onEmrChange("summary", event.target.value)}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="Primary Provider"
                  value={emrForm.primaryProvider}
                  onChange={(event) =>
                    onEmrChange("primaryProvider", event.target.value)
                  }
                />
                <TextField
                  fullWidth
                  label="Preferred Pharmacy"
                  value={emrForm.preferredPharmacy}
                  onChange={(event) =>
                    onEmrChange("preferredPharmacy", event.target.value)
                  }
                />
              </Stack>
              <TextField
                fullWidth
                label="Last Review"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={emrForm.lastReview}
                onChange={(event) =>
                  onEmrChange("lastReview", event.target.value)
                }
              />
            </Stack>
          </Card>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function RecordsDialog({
  open,
  tab,
  onTabChange,
  onClose,
  encounters,
  diagnoses,
  treatmentPlans,
  medications,
  vitals,
  labResults,
  allergies,
  encounterForm,
  diagnosisForm,
  treatmentPlanForm,
  medicationForm,
  vitalForm,
  labForm,
  allergyForm,
  onSelectEncounter,
  onSelectDiagnosis,
  onSelectTreatmentPlan,
  onSelectMedication,
  onSelectVital,
  onSelectLab,
  onSelectAllergy,
  onEncounterChange,
  onDiagnosisChange,
  onTreatmentPlanChange,
  onMedicationChange,
  onVitalChange,
  onLabChange,
  onAllergyChange,
  onSaveEncounter,
  onSaveDiagnosis,
  onSaveTreatmentPlan,
  onSaveMedication,
  onSaveVital,
  onSaveLab,
  onSaveAllergy,
  saving,
}: {
  open: boolean;
  tab: EditTabValue;
  onTabChange: (tab: EditTabValue) => void;
  onClose: () => void;
  encounters: EncounterData[];
  diagnoses: DiagnosisData[];
  treatmentPlans: TreatmentPlanData[];
  medications: MedicationData[];
  vitals: VitalData[];
  labResults: LabResultData[];
  allergies: AllergyData[];
  encounterForm: EncounterFormState;
  diagnosisForm: DiagnosisFormState;
  treatmentPlanForm: TreatmentPlanFormState;
  medicationForm: MedicationFormState;
  vitalForm: VitalFormState;
  labForm: LabFormState;
  allergyForm: AllergyFormState;
  onSelectEncounter: (id: string) => void;
  onSelectDiagnosis: (id: string) => void;
  onSelectTreatmentPlan: (id: string) => void;
  onSelectMedication: (id: string) => void;
  onSelectVital: (id: string) => void;
  onSelectLab: (id: string) => void;
  onSelectAllergy: (id: string) => void;
  onEncounterChange: (field: keyof EncounterFormState, value: string) => void;
  onDiagnosisChange: (field: keyof DiagnosisFormState, value: string) => void;
  onTreatmentPlanChange: (
    field: keyof TreatmentPlanFormState,
    value: string
  ) => void;
  onMedicationChange: (field: keyof MedicationFormState, value: string) => void;
  onVitalChange: (field: keyof VitalFormState, value: string) => void;
  onLabChange: (field: keyof LabFormState, value: string) => void;
  onAllergyChange: (
    field: keyof AllergyFormState,
    value: string | boolean
  ) => void;
  onSaveEncounter: () => void;
  onSaveDiagnosis: () => void;
  onSaveTreatmentPlan: () => void;
  onSaveMedication: () => void;
  onSaveVital: () => void;
  onSaveLab: () => void;
  onSaveAllergy: () => void;
  saving: EditTabValue | null;
}) {
  const renderTabContent = () => {
    switch (tab) {
      case "encounters":
        return (
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Existing encounters"
              value={encounterForm.id}
              onChange={(event) => {
                const value = event.target.value;
                if (value) {
                  onSelectEncounter(value);
                } else {
                  onSelectEncounter("");
                }
              }}
            >
              <MenuItem value="">New encounter</MenuItem>
              {encounters.map((enc) => (
                <MenuItem key={enc.id} value={enc.id}>
                  {enc.reason || enc.type} · {formatDateTime(enc.startTime)}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                select
                label="Type"
                value={encounterForm.type}
                onChange={(e) => onEncounterChange("type", e.target.value)}
              >
                {ENCOUNTER_TYPES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatLabel(value)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Status"
                value={encounterForm.status}
                onChange={(e) => onEncounterChange("status", e.target.value)}
              >
                {ENCOUNTER_STATUSES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatLabel(value)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Reason"
                value={encounterForm.reason}
                onChange={(e) => onEncounterChange("reason", e.target.value)}
              />
              <TextField
                fullWidth
                label="Location"
                value={encounterForm.location}
                onChange={(e) => onEncounterChange("location", e.target.value)}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={encounterForm.startTime}
                onChange={(e) => onEncounterChange("startTime", e.target.value)}
              />
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={encounterForm.endTime}
                onChange={(e) => onEncounterChange("endTime", e.target.value)}
              />
            </Stack>
            <TextField
              fullWidth
              label="Notes"
              multiline
              minRows={2}
              value={encounterForm.notes}
              onChange={(e) => onEncounterChange("notes", e.target.value)}
            />
            <Button
              variant="contained"
              onClick={onSaveEncounter}
              disabled={saving === "encounters"}
              startIcon={
                saving === "encounters" ? (
                  <CircularProgress size={18} />
                ) : undefined
              }
            >
              Save Encounter
            </Button>
          </Stack>
        );
      case "diagnoses":
        return (
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Existing diagnoses"
              value={diagnosisForm.id}
              onChange={(event) => {
                const value = event.target.value;
                if (value) {
                  onSelectDiagnosis(value);
                } else {
                  onSelectDiagnosis("");
                }
              }}
            >
              <MenuItem value="">New diagnosis</MenuItem>
              {diagnoses.map((dx) => (
                <MenuItem key={dx.id} value={dx.id}>
                  {dx.code} · {dx.description || dx.status}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Code"
                value={diagnosisForm.code}
                onChange={(e) => onDiagnosisChange("code", e.target.value)}
              />
              <TextField
                fullWidth
                select
                label="Status"
                value={diagnosisForm.status}
                onChange={(e) => onDiagnosisChange("status", e.target.value)}
              >
                {DIAGNOSIS_STATUSES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatLabel(value)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              fullWidth
              label="Description"
              value={diagnosisForm.description}
              onChange={(e) => onDiagnosisChange("description", e.target.value)}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Onset Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={diagnosisForm.onsetDate}
                onChange={(e) => onDiagnosisChange("onsetDate", e.target.value)}
              />
              <TextField
                fullWidth
                label="Resolved Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={diagnosisForm.resolvedDate}
                onChange={(e) =>
                  onDiagnosisChange("resolvedDate", e.target.value)
                }
              />
            </Stack>
            <Button
              variant="contained"
              onClick={onSaveDiagnosis}
              disabled={saving === "diagnoses"}
              startIcon={
                saving === "diagnoses" ? (
                  <CircularProgress size={18} />
                ) : undefined
              }
            >
              Save Diagnosis
            </Button>
          </Stack>
        );
      case "treatmentPlans":
        return (
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Existing treatment plans"
              value={treatmentPlanForm.id}
              onChange={(event) => {
                const value = event.target.value;
                if (value) {
                  onSelectTreatmentPlan(value);
                } else {
                  onSelectTreatmentPlan("");
                }
              }}
            >
              <MenuItem value="">New treatment plan</MenuItem>
              {treatmentPlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.goal || plan.status}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                select
                label="Status"
                value={treatmentPlanForm.status}
                onChange={(e) =>
                  onTreatmentPlanChange("status", e.target.value)
                }
              >
                {TREATMENT_STATUSES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatLabel(value)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Goal"
                value={treatmentPlanForm.goal}
                onChange={(e) => onTreatmentPlanChange("goal", e.target.value)}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={treatmentPlanForm.startDate}
                onChange={(e) =>
                  onTreatmentPlanChange("startDate", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={treatmentPlanForm.endDate}
                onChange={(e) =>
                  onTreatmentPlanChange("endDate", e.target.value)
                }
              />
            </Stack>
            <TextField
              fullWidth
              label="Notes"
              multiline
              minRows={2}
              value={treatmentPlanForm.notes}
              onChange={(e) => onTreatmentPlanChange("notes", e.target.value)}
            />
            <Button
              variant="contained"
              onClick={onSaveTreatmentPlan}
              disabled={saving === "treatmentPlans"}
              startIcon={
                saving === "treatmentPlans" ? (
                  <CircularProgress size={18} />
                ) : undefined
              }
            >
              Save Treatment Plan
            </Button>
          </Stack>
        );
      case "medications":
        return (
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Existing medications"
              value={medicationForm.id}
              onChange={(event) => {
                const value = event.target.value;
                if (value) {
                  onSelectMedication(value);
                } else {
                  onSelectMedication("");
                }
              }}
            >
              <MenuItem value="">New medication</MenuItem>
              {medications.map((med) => (
                <MenuItem key={med.id} value={med.id}>
                  {med.medicationName}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Medication Name"
                value={medicationForm.medicationName}
                onChange={(e) =>
                  onMedicationChange("medicationName", e.target.value)
                }
              />
              <TextField
                fullWidth
                select
                label="Route"
                value={medicationForm.route}
                onChange={(e) => onMedicationChange("route", e.target.value)}
              >
                {MEDICATION_ROUTES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatLabel(value)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Dosage"
                value={medicationForm.dosage}
                onChange={(e) => onMedicationChange("dosage", e.target.value)}
              />
              <TextField
                fullWidth
                label="Frequency"
                value={medicationForm.frequency}
                onChange={(e) =>
                  onMedicationChange("frequency", e.target.value)
                }
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={medicationForm.startDate}
                onChange={(e) =>
                  onMedicationChange("startDate", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={medicationForm.endDate}
                onChange={(e) => onMedicationChange("endDate", e.target.value)}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Prescribing Provider"
                value={medicationForm.prescribingProvider}
                onChange={(e) =>
                  onMedicationChange("prescribingProvider", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="Treatment Plan Id (optional)"
                value={medicationForm.treatmentPlanId}
                onChange={(e) =>
                  onMedicationChange("treatmentPlanId", e.target.value)
                }
              />
            </Stack>
            <TextField
              fullWidth
              label="Instructions"
              multiline
              minRows={2}
              value={medicationForm.instructions}
              onChange={(e) =>
                onMedicationChange("instructions", e.target.value)
              }
            />
            <Button
              variant="contained"
              onClick={onSaveMedication}
              disabled={saving === "medications"}
              startIcon={
                saving === "medications" ? (
                  <CircularProgress size={18} />
                ) : undefined
              }
            >
              Save Medication
            </Button>
          </Stack>
        );
      case "vitals":
        return (
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Existing vitals"
              value={vitalForm.id}
              onChange={(event) => {
                const value = event.target.value;
                if (value) {
                  onSelectVital(value);
                } else {
                  onSelectVital("");
                }
              }}
            >
              <MenuItem value="">New vital</MenuItem>
              {vitals.map((vital) => (
                <MenuItem key={vital.id} value={vital.id}>
                  {formatLabel(vital.type)} · {vital.value} {vital.unit}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                select
                label="Type"
                value={vitalForm.type}
                onChange={(e) => onVitalChange("type", e.target.value)}
              >
                {VITAL_TYPES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatLabel(value)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Unit"
                value={vitalForm.unit}
                onChange={(e) => onVitalChange("unit", e.target.value)}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Value"
                value={vitalForm.value}
                onChange={(e) => onVitalChange("value", e.target.value)}
              />
              <TextField
                fullWidth
                label="Recorded By"
                value={vitalForm.recordedBy}
                onChange={(e) => onVitalChange("recordedBy", e.target.value)}
              />
            </Stack>
            <TextField
              fullWidth
              label="Recorded At"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={vitalForm.recordedAt}
              onChange={(e) => onVitalChange("recordedAt", e.target.value)}
            />
            <Button
              variant="contained"
              onClick={onSaveVital}
              disabled={saving === "vitals"}
              startIcon={
                saving === "vitals" ? <CircularProgress size={18} /> : undefined
              }
            >
              Save Vital
            </Button>
          </Stack>
        );
      case "labs":
        return (
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Existing labs"
              value={labForm.id}
              onChange={(event) => {
                const value = event.target.value;
                if (value) {
                  onSelectLab(value);
                } else {
                  onSelectLab("");
                }
              }}
            >
              <MenuItem value="">New lab result</MenuItem>
              {labResults.map((lab) => (
                <MenuItem key={lab.id} value={lab.id}>
                  {lab.testName} · {lab.status}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Test Name"
                value={labForm.testName}
                onChange={(e) => onLabChange("testName", e.target.value)}
              />
              <TextField
                fullWidth
                select
                label="Status"
                value={labForm.status}
                onChange={(e) => onLabChange("status", e.target.value)}
              >
                {LAB_STATUSES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatLabel(value)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Result Value"
                value={labForm.resultValue}
                onChange={(e) => onLabChange("resultValue", e.target.value)}
              />
              <TextField
                fullWidth
                label="Units"
                value={labForm.units}
                onChange={(e) => onLabChange("units", e.target.value)}
              />
            </Stack>
            <TextField
              fullWidth
              label="Reference Range"
              value={labForm.referenceRange}
              onChange={(e) => onLabChange("referenceRange", e.target.value)}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Collected At"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={labForm.collectedAt}
                onChange={(e) => onLabChange("collectedAt", e.target.value)}
              />
              <TextField
                fullWidth
                label="Resulted At"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={labForm.resultedAt}
                onChange={(e) => onLabChange("resultedAt", e.target.value)}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Ordering Provider"
                value={labForm.orderingProvider}
                onChange={(e) =>
                  onLabChange("orderingProvider", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="Notes"
                value={labForm.notes}
                onChange={(e) => onLabChange("notes", e.target.value)}
              />
            </Stack>
            <Button
              variant="contained"
              onClick={onSaveLab}
              disabled={saving === "labs"}
              startIcon={
                saving === "labs" ? <CircularProgress size={18} /> : undefined
              }
            >
              Save Lab
            </Button>
          </Stack>
        );
      case "allergies":
        return (
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Existing allergies"
              value={allergyForm.id}
              onChange={(event) => {
                const value = event.target.value;
                if (value) {
                  onSelectAllergy(value);
                } else {
                  onSelectAllergy("");
                }
              }}
            >
              <MenuItem value="">New allergy</MenuItem>
              {allergies.map((allergy) => (
                <MenuItem key={allergy.id} value={allergy.id}>
                  {allergy.allergen}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Allergen"
                value={allergyForm.allergen}
                onChange={(e) => onAllergyChange("allergen", e.target.value)}
              />
              <TextField
                fullWidth
                select
                label="Severity"
                value={allergyForm.severity}
                onChange={(e) => onAllergyChange("severity", e.target.value)}
              >
                {SEVERITY_LEVELS.map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatLabel(value)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Reaction"
                value={allergyForm.reaction}
                onChange={(e) => onAllergyChange("reaction", e.target.value)}
              />
              <TextField
                fullWidth
                label="Noted At"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={allergyForm.notedAt}
                onChange={(e) => onAllergyChange("notedAt", e.target.value)}
              />
            </Stack>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allergyForm.isActive}
                  onChange={(e) =>
                    onAllergyChange("isActive", e.target.checked)
                  }
                />
              }
              label="Active"
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              minRows={2}
              value={allergyForm.notes}
              onChange={(e) => onAllergyChange("notes", e.target.value)}
            />
            <Button
              variant="contained"
              onClick={onSaveAllergy}
              disabled={saving === "allergies"}
              startIcon={
                saving === "allergies" ? (
                  <CircularProgress size={18} />
                ) : undefined
              }
            >
              Save Allergy
            </Button>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Manage Records</DialogTitle>
      <DialogContent dividers sx={{ pt: 1 }}>
        <Tabs
          value={tab}
          onChange={(_, value) => onTabChange(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {editTabs.map((item) => (
            <Tab key={item.value} label={item.label} value={item.value} />
          ))}
        </Tabs>
        {renderTabContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

interface DataTableCardProps<Row extends { id: string }> {
  title: string;
  rows: Row[];
  columns: Array<{
    label: string;
    render: (row: Row) => React.ReactNode;
  }>;
  emptyMessage: string;
}

function DataTableCard<Row extends { id: string }>({
  title,
  rows,
  columns,
  emptyMessage,
}: DataTableCardProps<Row>) {
  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>
      {rows.length ? (
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.label}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} hover>
                  {columns.map((column) => (
                    <TableCell key={column.label}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </Card>
  );
}

const toDateInputValue = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const toDateTimeInputValue = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
};

const toPatientForm = (profile: ProfileData): PatientFormState => ({
  firstName: profile.firstName || "",
  lastName: profile.lastName || "",
  dateOfBirth: toDateInputValue(profile.dateOfBirth),
  gender: profile.gender || "",
  phoneNumber: profile.phoneNumber || "",
  email: profile.email || "",
});

const toEmrForm = (
  medicalRecord: ProfileData["medicalRecord"]
): EmrFormState => ({
  summary: medicalRecord?.summary || "",
  primaryProvider: medicalRecord?.primaryProvider || "",
  preferredPharmacy: medicalRecord?.preferredPharmacy || "",
  lastReview: toDateInputValue(medicalRecord?.lastReview ?? null),
});

const getAgeFromIso = (iso: string) => {
  const dob = new Date(iso);
  if (Number.isNaN(dob.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
};

const newEncounterForm = (enc?: EncounterData): EncounterFormState => ({
  id: enc?.id ?? "",
  type: enc?.type ?? "ROUTINE",
  status: enc?.status ?? "SCHEDULED",
  reason: enc?.reason ?? "",
  location: enc?.location ?? "",
  startTime: toDateTimeInputValue(enc?.startTime ?? null),
  endTime: toDateTimeInputValue(enc?.endTime ?? null),
  notes: enc?.notes ?? "",
});

const newDiagnosisForm = (dx?: DiagnosisData): DiagnosisFormState => ({
  id: dx?.id ?? "",
  encounterId: "",
  code: dx?.code ?? "",
  description: dx?.description ?? "",
  status: dx?.status ?? "ACTIVE",
  onsetDate: toDateInputValue(dx?.onsetDate ?? null),
  resolvedDate: toDateInputValue(dx?.resolvedDate ?? null),
});

const newTreatmentPlanForm = (
  plan?: TreatmentPlanData
): TreatmentPlanFormState => ({
  id: plan?.id ?? "",
  encounterId: "",
  diagnosisId: "",
  status: plan?.status ?? "PLANNED",
  goal: plan?.goal ?? "",
  startDate: toDateInputValue(plan?.startDate ?? null),
  endDate: toDateInputValue(plan?.endDate ?? null),
  notes: plan?.notes ?? "",
});

const newMedicationForm = (med?: MedicationData): MedicationFormState => ({
  id: med?.id ?? "",
  treatmentPlanId: med?.treatmentPlanId ?? "",
  medicationName: med?.medicationName ?? "",
  dosage: med?.dosage ?? "",
  route: med?.route ?? "ORAL",
  frequency: med?.frequency ?? "",
  startDate: toDateInputValue(med?.startDate ?? null),
  endDate: toDateInputValue(med?.endDate ?? null),
  prescribingProvider: med?.prescribingProvider ?? "",
  instructions: med?.instructions ?? "",
});

const newVitalForm = (vital?: VitalData): VitalFormState => ({
  id: vital?.id ?? "",
  type: vital?.type ?? "HEART_RATE",
  value: vital ? String(vital.value) : "",
  unit: vital?.unit ?? "",
  recordedAt: toDateTimeInputValue(vital?.recordedAt ?? null),
  recordedBy: vital?.recordedBy ?? "",
});

const newLabForm = (lab?: LabResultData): LabFormState => ({
  id: lab?.id ?? "",
  testName: lab?.testName ?? "",
  status: lab?.status ?? "PENDING",
  resultValue: lab?.resultValue ?? "",
  units: lab?.units ?? "",
  referenceRange: lab?.referenceRange ?? "",
  collectedAt: toDateTimeInputValue(lab?.collectedAt ?? null),
  resultedAt: toDateTimeInputValue(lab?.resultedAt ?? null),
  orderingProvider: lab?.orderingProvider ?? "",
  notes: lab?.notes ?? "",
});

const newAllergyForm = (allergy?: AllergyData): AllergyFormState => ({
  id: allergy?.id ?? "",
  allergen: allergy?.allergen ?? "",
  reaction: allergy?.reaction ?? "",
  severity: allergy?.severity ?? "MODERATE",
  isActive: allergy?.isActive ?? true,
  notedAt: toDateInputValue(allergy?.notedAt ?? null),
  notes: allergy?.notes ?? "",
});

const normalizeEncounter = (enc: any): EncounterData => ({
  id: enc.id,
  type: enc.type,
  status: enc.status,
  reason: enc.reason ?? "",
  location: enc.location ?? "",
  medicalRecordId: enc.medicalRecordId,
  startTime: enc.startTime ?? null,
  endTime: enc.endTime ?? null,
  notes: enc.notes ?? "",
});

const normalizeDiagnosis = (dx: any): DiagnosisData => ({
  id: dx.id,
  code: dx.code,
  description: dx.description ?? "",
  status: dx.status,
  onsetDate: dx.onsetDate ?? null,
  resolvedDate: dx.resolvedDate ?? null,
  createdAt: dx.createdAt ?? null,
});

const normalizeTreatmentPlan = (plan: any): TreatmentPlanData => ({
  id: plan.id,
  status: plan.status,
  goal: plan.goal ?? "",
  startDate: plan.startDate ?? null,
  endDate: plan.endDate ?? null,
  notes: plan.notes ?? "",
  medications: [], // filled elsewhere if needed
});

const normalizeMedication = (med: any): MedicationData => ({
  id: med.id,
  treatmentPlanId: med.treatmentPlanId ?? null,
  medicationName: med.medicationName,
  dosage: med.dosage ?? "",
  route: med.route,
  frequency: med.frequency ?? "",
  startDate: med.startDate ?? null,
  endDate: med.endDate ?? null,
  prescribingProvider: med.prescribingProvider ?? "",
  instructions: med.instructions ?? "",
  status:
    med.endDate && new Date(med.endDate) < new Date() ? "Completed" : "Active",
});

const normalizeVital = (v: any): VitalData => ({
  id: v.id,
  type: v.type,
  value: typeof v.value === "number" ? v.value : Number(v.value) || 0,
  unit: v.unit ?? "",
  recordedAt: v.recordedAt ?? null,
  recordedBy: v.recordedBy ?? "",
});

const normalizeLab = (lab: any): LabResultData => ({
  id: lab.id,
  testName: lab.testName,
  status: lab.status,
  resultValue: lab.resultValue ?? "",
  units: lab.units ?? "",
  referenceRange: lab.referenceRange ?? "",
  collectedAt: lab.collectedAt ?? null,
  resultedAt: lab.resultedAt ?? null,
  orderingProvider: lab.orderingProvider ?? "",
  notes: lab.notes ?? "",
});

const normalizeAllergy = (allergy: any): AllergyData => ({
  id: allergy.id,
  medicalRecordId: allergy.medicalRecordId,
  allergen: allergy.allergen,
  reaction: allergy.reaction ?? "",
  severity: allergy.severity,
  isActive: Boolean(allergy.isActive),
  notedAt: allergy.notedAt ?? null,
  notes: allergy.notes ?? "",
});

const upsertById = <T extends { id: string }>(list: T[], item: T): T[] => {
  const idx = list.findIndex((entry) => entry.id === item.id);
  if (idx >= 0) {
    const next = [...list];
    next[idx] = item;
    return next;
  }
  return [item, ...list];
};

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");

const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(iso));
};

const formatDateTimeRange = (start?: string | null, end?: string | null) => {
  if (!start) return "—";
  const startDate = new Date(start);
  const startFormatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(startDate);

  if (!end) return startFormatted;
  const endDate = new Date(end);
  const endFormatted = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(endDate);

  return `${startFormatted} – ${endFormatted}`;
};
