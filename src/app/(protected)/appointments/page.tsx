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
import {
  APPOINTMENT_STATUS_COLORS,
  type AppointmentStatus,
} from "@/lib/constants";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(weekday);

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
  const [viewMode, setViewMode] = useState<View>("agenda");
  const [filters, setFilters] = useState<AppointmentStatus[]>([
    "APPROVED",
    "PENDING",
  ]);
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

  const colorsForStatus = (status: AppointmentStatus) =>
    APPOINTMENT_STATUS_COLORS[status];

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
    <Box
      sx={{
        maxWidth: "1280px",
        mx: "auto",
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 0 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: { xs: "1.35rem", sm: "1.6rem", md: "1.8rem" },
            }}
          >
            <CalendarMonth /> My Appointments
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
            View and request appointments. Default duration is 30 minutes.
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{ width: { xs: "100%", sm: "auto" }, justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setBookingOpen(true)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
              py: { xs: 1, sm: 1.2 },
            }}
          >
            Book
          </Button>
        </Stack>
      </Box>

      <Card sx={{ p: { xs: 2, md: 3 }, mb: 1 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              width: "100%",
              justifyContent: { xs: "space-between", md: "flex-start" },
            }}
          >
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
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}
            >
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
            <Button
              size="small"
              variant="outlined"
              onClick={handleGoToToday}
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                px: 1.5,
                py: 0.75,
              }}
            >
              Today
            </Button>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
              width: "100%",
              justifyContent: "flex-end",
              alignItems: { xs: "stretch", sm: "center" },
            }}
          >
            <ToggleButtonGroup
              value={filters}
              onChange={(_, values) => values.length && setFilters(values)}
              size="small"
              sx={{
                width: { xs: "100%", sm: "auto" },
                "& .MuiToggleButton-root": {
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  px: { xs: 1, sm: 1.5 },
                },
              }}
            >
              {(
                [
                  "APPROVED",
                  "PENDING",
                  "REJECTED",
                  "CANCELLED",
                ] as AppointmentStatus[]
              ).map((status) => (
                <ToggleButton
                  key={status}
                  value={status}
                  sx={{ flex: 1, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                >
                  {formatLabel(status)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        <Box sx={{ height: { xs: 480, sm: 560, md: 640 } }}>
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
            style={{ height: "100%" }}
            components={{}}
            eventPropGetter={eventPropGetter}
          />
        </Box>
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
