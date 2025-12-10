"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Add,
  Cancel,
  ChevronLeft,
  ChevronRight,
  EditCalendar,
  Sms,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Calendar as BigCalendar,
  dayjsLocalizer,
  SlotInfo,
  View,
} from "react-big-calendar";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import "react-big-calendar/lib/css/react-big-calendar.css";

dayjs.extend(utc);
dayjs.extend(weekday);

type AppointmentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

type AppointmentType =
  | "CHECK_UP"
  | "CONSULTATION"
  | "FOLLOW_UP"
  | "ANNUAL_PHYSICAL"
  | "TELEHEALTH"
  | "URGENT";

type Appointment = {
  id: string;
  patientId: string;
  patientName: string | null;
  status: AppointmentStatus;
  type: AppointmentType;
  startTime: string;
  endTime: string;
  notes: string;
  isRescheduled: boolean;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
};

const localizer = dayjsLocalizer(dayjs);
const initialCalendarDate = dayjs();
const defaultDurationMinutes = 30;

const STATUS_COLORS: Record<
  AppointmentStatus,
  { bg: string; border: string; text: string }
> = {
  APPROVED: { bg: "#e8f5e9", border: "#2e7d32", text: "#1b5e20" },
  PENDING: { bg: "#fff8e1", border: "#f9a825", text: "#f57f17" },
  REJECTED: { bg: "#ffebee", border: "#c62828", text: "#b71c1c" },
  CANCELLED: { bg: "#eceff1", border: "#607d8b", text: "#455a64" },
};

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");

const formatDateRange = (apt: Appointment | null) => {
  if (!apt) return "";
  const start = dayjs(apt.startTime);
  const end = dayjs(apt.endTime);
  return `${start.format("ddd, MMM D, h:mm A")} - ${end.format("h:mm A")}`;
};

export default function AdminAppointmentsPage() {
  const [currentDate, setCurrentDate] = useState<Dayjs>(initialCalendarDate);
  const [viewMode, setViewMode] = useState<View>("agenda");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [filters, setFilters] = useState<AppointmentStatus[]>([
    "APPROVED",
    "PENDING",
  ]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    start: dayjs().toISOString(),
    duration: defaultDurationMinutes,
  });

  const filteredAppointments = useMemo(
    () => appointments.filter((apt) => filters.includes(apt.status)),
    [appointments, filters]
  );

  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      filteredAppointments.map((apt) => ({
        id: apt.id,
        title: formatLabel(apt.type),
        start: new Date(apt.startTime),
        end: new Date(apt.endTime),
        resource: apt,
      })),
    [filteredAppointments]
  );

  const fetchAppointments = async (statuses: AppointmentStatus[]) => {
    setLoading(true);
    try {
      const statusParam = statuses.join(",");
      const response = await fetch(
        `/api/admin/appointments?status=${encodeURIComponent(statusParam)}`
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to load appointments.");
      }
      setAppointments(payload.appointments ?? []);
      setSelectedAppointment(payload.appointments?.[0] ?? null);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load appointments.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCalendarNavigate = (date: Date) => setCurrentDate(dayjs(date));

  const handleSlotSelect = (_slot: SlotInfo) => {};

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleFiltersChange = (_: unknown, values: AppointmentStatus[]) => {
    if (!values.length) return;
    setFilters(values);
    fetchAppointments(values);
  };

  const eventPropGetter = (event: CalendarEvent) => {
    const colors = STATUS_COLORS[event.resource.status];
    return {
      style: {
        backgroundColor: colors.bg,
        borderLeft: `3px solid ${colors.border}`,
        color: colors.text,
        borderRadius: 8,
        padding: "2px 6px",
      },
    };
  };

  const handleGoToToday = () => setCurrentDate(dayjs());

  const updateAppointment = async (body: Record<string, any>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to update appointment.");
      }
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === payload.appointment.id ? payload.appointment : apt
        )
      );
      setSelectedAppointment(payload.appointment);
      setFeedback({ type: "success", message: "Appointment updated." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update appointment.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    if (!selectedAppointment) return;
    updateAppointment({
      id: selectedAppointment.id,
      status: "APPROVED",
      isRescheduled: false,
    });
  };

  const handleCancel = () => {
    if (!selectedAppointment) return;
    updateAppointment({ id: selectedAppointment.id, status: "CANCELLED" });
  };

  const openReschedule = () => {
    if (!selectedAppointment) return;
    setRescheduleForm({
      start: selectedAppointment.startTime,
      duration: defaultDurationMinutes,
    });
    setRescheduleOpen(true);
  };

  const submitReschedule = () => {
    if (!selectedAppointment) return;
    const start = dayjs(rescheduleForm.start);
    const end = start.add(rescheduleForm.duration, "minute");
    updateAppointment({
      id: selectedAppointment.id,
      status: "APPROVED",
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      isRescheduled: true,
    });
    setRescheduleOpen(false);
  };

  const renderEvent = ({ event }: { event: CalendarEvent }) => {
    const apt = event.resource;
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
          {formatLabel(apt.type)}
        </Typography>
        <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary" }}>
          {formatLabel(apt.status)}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: "1280px", mx: "auto", py: 4, px: { xs: 2, md: 0 } }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Admin Appointments
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
            Approve, reschedule, or cancel. Approved shown first; toggle pending
            to review requests.
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={filters}
          onChange={handleFiltersChange}
          size="small"
          sx={{ flexWrap: "wrap" }}
        >
          {(
            [
              "APPROVED",
              "PENDING",
              "REJECTED",
              "CANCELLED",
            ] as AppointmentStatus[]
          ).map((status) => (
            <ToggleButton key={status} value={status}>
              {formatLabel(status)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              pb: 2,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() =>
                  setCurrentDate(
                    currentDate.subtract(
                      1,
                      viewMode === "month"
                        ? "month"
                        : viewMode === "week"
                        ? "week"
                        : "day"
                    )
                  )
                }
              >
                <ChevronLeft />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {currentDate.format("MMMM YYYY")}
              </Typography>
              <IconButton
                size="small"
                onClick={() =>
                  setCurrentDate(
                    currentDate.add(
                      1,
                      viewMode === "month"
                        ? "month"
                        : viewMode === "week"
                        ? "week"
                        : "day"
                    )
                  )
                }
              >
                <ChevronRight />
              </IconButton>
              <Button size="small" variant="outlined" onClick={handleGoToToday}>
                Today
              </Button>
            </Box>
          </Box>

          <Box sx={{ flex: 1, mt: 2 }}>
            <BigCalendar
              localizer={localizer}
              events={calendarEvents}
              date={currentDate.toDate()}
              view={viewMode}
              onView={setViewMode}
              onNavigate={handleCalendarNavigate}
              selectable
              onSelectEvent={(event: { resource: Appointment }) =>
                handleAppointmentClick(event.resource)
              }
              onSelectSlot={handleSlotSelect}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 640 }}
              components={{ event: renderEvent }}
              eventPropGetter={eventPropGetter}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={currentDate}
                onChange={(date) => date && setCurrentDate(date)}
              />
            </LocalizationProvider>
          </Card>

          <Card
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Appointment Details
            </Typography>
            {selectedAppointment ? (
              <Stack spacing={1.5}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Patient
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {selectedAppointment.patientName ||
                    selectedAppointment.patientId}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Type
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {formatLabel(selectedAppointment.type)}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Status
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {formatLabel(selectedAppointment.status)}
                  {selectedAppointment.isRescheduled ? " (Rescheduled)" : ""}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Schedule
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {formatDateRange(selectedAppointment)}
                </Typography>
                {selectedAppointment.notes ? (
                  <>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Notes
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {selectedAppointment.notes}
                    </Typography>
                  </>
                ) : null}
                <Divider />
                <Stack spacing={1}>
                  {selectedAppointment.status === "PENDING" ? (
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleApprove}
                      disabled={loading}
                    >
                      Approve
                    </Button>
                  ) : null}
                  <Button
                    variant="outlined"
                    startIcon={<EditCalendar />}
                    onClick={openReschedule}
                    disabled={
                      !["APPROVED", "RESCHEDULED"].includes(
                        selectedAppointment.status
                      ) || loading
                    }
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Sms />}
                    disabled
                    title="SMS not wired"
                  >
                    Send SMS Reminder
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Typography
                sx={{ color: "text.secondary", textAlign: "center", py: 4 }}
              >
                Select an appointment to view details
              </Typography>
            )}
          </Card>
        </Box>
      </Box>

      <Dialog
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Start"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={dayjs(rescheduleForm.start).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) =>
                setRescheduleForm((prev) => ({
                  ...prev,
                  start: dayjs(e.target.value).toISOString(),
                }))
              }
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              value={rescheduleForm.duration}
              onChange={(e) =>
                setRescheduleForm((prev) => ({
                  ...prev,
                  duration: Number(e.target.value) || defaultDurationMinutes,
                }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduleOpen(false)}>Close</Button>
          <Button
            onClick={submitReschedule}
            variant="contained"
            disabled={loading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {feedback && (
        <Snackbar
          open
          autoHideDuration={4000}
          onClose={() => setFeedback(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setFeedback(null)}
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
