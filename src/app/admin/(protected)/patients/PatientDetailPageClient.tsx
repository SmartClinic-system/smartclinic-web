"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  medicationName: string;
  dosage: string;
  route: string;
  frequency: string;
  startDate: string | null;
  endDate: string | null;
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
    () => data.medications.filter((med) => med.status === "Active"),
    [data.medications]
  );

  const allergyBadges = data.allergies.filter((allergy) => allergy.isActive);

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
            rows={applySearch(data.diagnoses, (row) => [
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
            rows={applySearch(data.treatmentPlans, (row) => [
              row.goal,
              row.status,
            ])}
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
            rows={applySearch(data.encounters, (row) => [
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
            rows={applySearch(data.labResults, (row) => [
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
            rows={applySearch(data.medications, (row) => [
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
            rows={applySearch(data.vitals, (row) => [
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
}: {
  profile: ProfileData;
  allergies: AllergyData[];
  onEdit: () => void;
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
