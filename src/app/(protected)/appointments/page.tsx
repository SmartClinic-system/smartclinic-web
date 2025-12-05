"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Add,
  CalendarMonth,
  Cancel,
  ChevronLeft,
  ChevronRight,
  EventAvailable,
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
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  Calendar as BigCalendar,
  dayjsLocalizer,
  SlotInfo,
  View,
} from "react-big-calendar";
import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import "react-big-calendar/lib/css/react-big-calendar.css";

dayjs.extend(localizedFormat);
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
const STATUS_COLORS: Record<
  AppointmentStatus,
  { bg: string; border: string; text: string }
> = {
  APPROVED: { bg: "#e8f5e9", border: "#2e7d32", text: "#1b5e20" },
  PENDING: { bg: "#fff8e1", border: "#f9a825", text: "#f57f17" },
  REJECTED: { bg: "#ffebee", border: "#c62828", text: "#b71c1c" },
  CANCELLED: { bg: "#eceff1", border: "#607d8b", text: "#455a64" },
};

const APPOINTMENT_TYPES: AppointmentType[] = [
  "CHECK_UP",
  "CONSULTATION",
  "FOLLOW_UP",
  "ANNUAL_PHYSICAL",
  "TELEHEALTH",
  "URGENT",
];

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");

const defaultDurationMinutes = 30;

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [viewMode, setViewMode] = useState<View>("week");
  const [filters, setFilters] = useState<AppointmentStatus[]>(["APPROVED"]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: "CHECK_UP" as AppointmentType,
    start: dayjs()
      .minute(0)
      .second(0)
      .millisecond(0)
      .add(1, "hour")
      .toISOString(),
    duration: defaultDurationMinutes,
    notes: "",
  });
  const patientSlug = "self";

  const filteredAppointments = useMemo(
    () => appointments.filter((apt) => filters.includes(apt.status)),
    [appointments, filters]
  );

  const events: CalendarEvent[] = useMemo(
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

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${patientSlug}/appointments`);
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload?.error || "Failed to load appointments.");
      setAppointments(payload.appointments ?? []);
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
    fetchAppointments();
  }, []);

  const handleBook = async () => {
    setLoading(true);
    try {
      const start = dayjs(form.start);
      const end = start.add(form.duration, "minute");
      const response = await fetch(
        `/api/patients/${patientSlug}/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: form.type,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            notes: form.notes,
          }),
        }
      );
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload?.error || "Unable to book appointment.");
      setAppointments((prev) => [payload.appointment, ...prev]);
      setBookingOpen(false);
      setFeedback({ type: "success", message: "Appointment requested." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to book appointment.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarNavigate = (date: Date) => setCurrentDate(dayjs(date));

  const handleSlotSelect = (slot: SlotInfo) => {
    const start = dayjs(slot.start);
    setForm((prev) => ({
      ...prev,
      start: start.toISOString(),
    }));
    setBookingOpen(true);
  };

  const handleGoToToday = () => setCurrentDate(dayjs());

  const colorsForStatus = (status: AppointmentStatus) => STATUS_COLORS[status];

  const eventPropGetter = (event: CalendarEvent) => {
    const colors = colorsForStatus(event.resource.status);
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CalendarMonth /> My Appointments
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
            View and request appointments. Default duration is 30 minutes.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setBookingOpen(true)}
          >
            Book
          </Button>
        </Stack>
      </Box>

      <Card sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              onClick={() =>
                handleCalendarNavigate(
                  currentDate
                    .subtract(
                      1,
                      viewMode === "month"
                        ? "month"
                        : viewMode === "week"
                        ? "week"
                        : "day"
                    )
                    .toDate()
                )
              }
            >
              <ChevronLeft />
            </IconButton>
            <Typography variant="h6">
              {currentDate.format("MMMM YYYY")}
            </Typography>
            <IconButton
              size="small"
              onClick={() =>
                handleCalendarNavigate(
                  currentDate
                    .add(
                      1,
                      viewMode === "month"
                        ? "month"
                        : viewMode === "week"
                        ? "week"
                        : "day"
                    )
                    .toDate()
                )
              }
            >
              <ChevronRight />
            </IconButton>
            <Button size="small" variant="outlined" onClick={handleGoToToday}>
              Today
            </Button>
          </Stack>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            size="small"
            onChange={(_, value) => value && setViewMode(value)}
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={filters}
            onChange={(_, values) => values.length && setFilters(values)}
            size="small"
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
        </Stack>

        <BigCalendar
          localizer={localizer}
          events={events}
          date={currentDate.toDate()}
          view={viewMode}
          onView={(v: View) => setViewMode(v)}
          onNavigate={handleCalendarNavigate}
          selectable
          onSelectSlot={handleSlotSelect}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 640 }}
          components={{}}
          eventPropGetter={eventPropGetter}
        />
      </Card>

      <Dialog
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              select
              label="Appointment Type"
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value as AppointmentType,
                }))
              }
            >
              {APPOINTMENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {formatLabel(type)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Start"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={dayjs(form.start).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  start: dayjs(e.target.value).toISOString(),
                }))
              }
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              value={form.duration}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  duration: Number(e.target.value) || defaultDurationMinutes,
                }))
              }
            />
            <TextField
              label="Notes"
              multiline
              minRows={3}
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingOpen(false)}>Close</Button>
          <Button onClick={handleBook} variant="contained" disabled={loading}>
            Request
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
            severity={feedback.type}
            onClose={() => setFeedback(null)}
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
