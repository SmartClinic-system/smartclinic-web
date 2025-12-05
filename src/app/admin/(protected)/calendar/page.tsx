"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import {
  Add,
  ChevronLeft,
  ChevronRight,
  EditCalendar,
  Sms,
  Cancel,
} from "@mui/icons-material";
import {
  Calendar as BigCalendar,
  dayjsLocalizer,
  EventProps,
  SlotInfo,
  View,
} from "react-big-calendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import "react-big-calendar/lib/css/react-big-calendar.css";

dayjs.extend(localizedFormat);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(weekday);

interface Appointment {
  id: number;
  patientName: string;
  type: string;
  color: "amber" | "green" | "gray";
  start: string;
  end: string;
}

type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
};

const appointments: Appointment[] = [
  {
    id: 1,
    patientName: "Liam Gallagher",
    type: "Check-up",
    color: "amber",
    start: "2024-10-04T09:00:00",
    end: "2024-10-04T09:45:00",
  },
  {
    id: 2,
    patientName: "Olivia Chen",
    type: "Consultation",
    color: "green",
    start: "2024-10-05T11:30:00",
    end: "2024-10-05T12:15:00",
  },
  {
    id: 3,
    patientName: "Noah Patel",
    type: "Follow-up",
    color: "green",
    start: "2024-10-07T14:00:00",
    end: "2024-10-07T15:00:00",
  },
  {
    id: 4,
    patientName: "Ava Rodriguez",
    type: "Annual Physical",
    color: "gray",
    start: "2024-10-09T10:00:00",
    end: "2024-10-09T11:00:00",
  },
];

const localizer = dayjsLocalizer(dayjs);
const MONTH_GRID_CELL_COUNT = 42;
const initialCalendarDate = dayjs("2024-10-05");

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] =
    useState<Dayjs>(initialCalendarDate);
  const [viewMode, setViewMode] = useState<"Daily" | "Weekly" | "Monthly">(
    "Weekly"
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(
      appointments.find((apt) =>
        dayjs(apt.start).isSame(initialCalendarDate, "day")
      ) || null
    );

  const getColorStyles = (color: Appointment["color"]) => {
    const colors: Record<
      Appointment["color"],
      { bg: string; border: string; text: string; textSecondary: string }
    > = {
      amber: {
        bg: "rgba(251, 191, 36, 0.1)",
        border: "#f59e0b",
        text: "#92400e",
        textSecondary: "#d97706",
      },
      green: {
        bg: "rgba(34, 197, 94, 0.1)",
        border: "#22c55e",
        text: "#166534",
        textSecondary: "#16a34a",
      },
      gray: {
        bg: "rgba(107, 114, 128, 0.1)",
        border: "#6b7280",
        text: "#374151",
        textSecondary: "#6b7280",
      },
    };
    return colors[color] || colors.gray;
  };

  const formatAppointmentTimeRange = (appointment: Appointment) => {
    const start = dayjs(appointment.start);
    const end = dayjs(appointment.end);
    return `${start.format("h:mm A")} - ${end.format("h:mm A")}`;
  };

  const formatAppointmentDateTime = (appointment: Appointment) => {
    return dayjs(appointment.start).format("dddd, MMM D, YYYY [at] h:mm A");
  };

  const getReminderTimestamp = (appointment: Appointment) => {
    return dayjs(appointment.start)
      .subtract(1, "day")
      .format("MMM D, h:mm A");
  };

  const updateSelectionForDate = (targetDate: Dayjs) => {
    const match =
      appointments.find((apt) =>
        dayjs(apt.start).isSame(targetDate, "day")
      ) || null;
    setSelectedAppointment(match);
  };

  const getAppointmentsForDate = (date: Dayjs) => {
    return appointments.filter((apt) =>
      dayjs(apt.start).isSame(date, "day")
    );
  };

  const isToday = (date: Dayjs) => {
    return date.isSame(dayjs(), "day");
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    if (!newDate) return;
    setCurrentDate(newDate);
    updateSelectionForDate(newDate);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setCurrentDate(dayjs(appointment.start));
    setSelectedAppointment(appointment);
  };

  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    return appointments.map((apt) => ({
      id: apt.id,
      title: apt.patientName,
      start: dayjs(apt.start).toDate(),
      end: dayjs(apt.end).toDate(),
      resource: apt,
    }));
  }, []);

  const calendarDays = useMemo(() => {
    const monthStart = currentDate.startOf("month");
    const firstVisibleDay = monthStart.startOf("week");
    return Array.from({ length: MONTH_GRID_CELL_COUNT }, (_, index) =>
      firstVisibleDay.add(index, "day")
    );
  }, [currentDate]);

  const handleCalendarNavigate = (date: Date) => {
    const nextDate = dayjs(date);
    setCurrentDate(nextDate);
    updateSelectionForDate(nextDate);
  };

  const handleCalendarViewChange = (nextView: View) => {
    if (nextView === "day") {
      setViewMode("Daily");
    } else if (nextView === "week") {
      setViewMode("Weekly");
    } else {
      setViewMode("Monthly");
    }
  };

  const handleSlotSelect = (slotInfo: SlotInfo) => {
    const nextDate = dayjs(slotInfo.start);
    setCurrentDate(nextDate);
    updateSelectionForDate(nextDate);
  };

  const navigateByView = (direction: "prev" | "next") => {
    const unit =
      viewMode === "Daily"
        ? "day"
        : viewMode === "Weekly"
        ? "week"
        : "month";
    const delta = direction === "prev" ? -1 : 1;
    const nextDate = currentDate.add(delta, unit);
    setCurrentDate(nextDate);
    updateSelectionForDate(nextDate);
  };

  const renderEvent = ({ event }: EventProps<CalendarEvent>) => {
    const appointment = event.resource;
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
          {appointment.patientName}
        </Typography>
        <Typography
          sx={{ fontSize: "0.6875rem", color: "text.secondary" }}
        >
          {appointment.type}
        </Typography>
      </Box>
    );
  };

  const eventPropGetter = (event: CalendarEvent) => {
    const colors = getColorStyles(event.resource.color);
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

  const handleGoToToday = () => {
    const today = dayjs();
    setCurrentDate(today);
    updateSelectionForDate(today);
  };

  return (
    <Box sx={{ maxWidth: "1280px", mx: "auto" }}>
      {/* Page Heading */}
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
              fontSize: "1.875rem",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Appointments
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
            Manage and schedule all patient appointments.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            minWidth: 84,
            height: 40,
          }}
        >
          New Appointment
        </Button>
      </Box>

      {/* Calendar View */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* Calendar Section */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {/* Toolbar */}
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
              <IconButton size="small" onClick={() => navigateByView("prev")}>
                <ChevronLeft />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {currentDate.format("MMMM YYYY")}
              </Typography>
              <IconButton size="small" onClick={() => navigateByView("next")}>
                <ChevronRight />
              </IconButton>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  ml: 1,
                  height: 36,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  textTransform: "none",
                }}
                onClick={handleGoToToday}
              >
                Today
              </Button>
            </Box>

            {/* View Mode Toggle */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newValue) => newValue && setViewMode(newValue)}
              size="small"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                height: 36,
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  border: "none",
                  "&.Mui-selected": {
                    backgroundColor: "background.paper",
                    boxShadow: 1,
                    color: "text.primary",
                  },
                },
              }}
            >
              <ToggleButton value="Daily">Daily</ToggleButton>
              <ToggleButton value="Weekly">Weekly</ToggleButton>
              <ToggleButton value="Monthly">Monthly</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Calendar Grid / Scheduler */}
          <Box sx={{ flex: 1, mt: 2 }}>
            {viewMode === "Monthly" ? (
              <>
                {/* Day Headers */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                  }}
                >
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <Typography
                        key={day}
                        sx={{
                          textAlign: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          py: 1,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          color: "text.secondary",
                        }}
                      >
                        {day}
                      </Typography>
                    )
                  )}
                </Box>

                {/* Calendar Days */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                  }}
                >
                  {calendarDays.map((day, index) => {
                    const isCurrentMonth = day.isSame(currentDate, "month");
                    const dayAppointments = getAppointmentsForDate(day);
                    const isCurrentDay = isToday(day);

                    return (
                      <Box
                        key={day.format("YYYY-MM-DD")}
                        sx={{
                          borderRight: index % 7 !== 6 ? "1px solid" : "none",
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          p: 0.5,
                          minHeight: 128,
                          textAlign: "right",
                          backgroundColor: isCurrentDay
                            ? "rgba(59, 130, 246, 0.05)"
                            : "transparent",
                          color: isCurrentMonth
                            ? "text.primary"
                            : "text.secondary",
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          {isCurrentDay ? (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                backgroundColor: "primary.main",
                                color: "white",
                                fontWeight: 700,
                                fontSize: "0.875rem",
                                mb: 0.5,
                              }}
                            >
                              {day.date()}
                            </Box>
                          ) : (
                            <Typography sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                              {day.date()}
                            </Typography>
                          )}
                        </Box>
                        {dayAppointments.map((apt) => {
                          const colors = getColorStyles(apt.color);
                          return (
                            <Box
                              key={apt.id}
                              onClick={() => handleAppointmentClick(apt)}
                              sx={{
                                backgroundColor: colors.bg,
                                borderLeft: `2px solid ${colors.border}`,
                                borderRadius: 0.5,
                                textAlign: "left",
                                p: 0.5,
                                mt: 0.5,
                                cursor: "pointer",
                                "&:hover": {
                                  opacity: 0.85,
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  color: colors.text,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {apt.patientName}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "0.625rem",
                                  color: colors.textSecondary,
                                }}
                              >
                                {formatAppointmentTimeRange(apt)}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    );
                  })}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: { xs: 1, sm: 2 },
                  "& .rbc-time-header": {
                    borderColor: "divider",
                  },
                  "& .rbc-time-content": {
                    borderColor: "divider",
                  },
                  "& .rbc-time-view": {
                    border: "none",
                  },
                }}
              >
                <BigCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  date={currentDate.toDate()}
                  view={viewMode === "Daily" ? "day" : "week"}
                  views={["day", "week"]}
                  onView={handleCalendarViewChange}
                  onNavigate={handleCalendarNavigate}
                  selectable
                  onSelectEvent={(event) =>
                    handleAppointmentClick(event.resource)
                  }
                  onSelectSlot={handleSlotSelect}
                  toolbar={false}
                  step={30}
                  timeslots={2}
                  components={{ event: renderEvent }}
                  eventPropGetter={eventPropGetter}
                  min={currentDate.hour(7).minute(0).second(0).toDate()}
                  max={currentDate.hour(19).minute(0).second(0).toDate()}
                  style={{ height: 640 }}
                />
              </Box>
            )}
          </Box>
        </Box>

        {/* Right Sidebar */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Calendar Picker */}
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
                onChange={handleDateChange}
                sx={{
                  "& .MuiPickersCalendarHeader-root": {
                    marginTop: 0,
                  },
                  "& .MuiDayCalendar-weekContainer": {
                    marginTop: 0.5,
                  },
                  "& .MuiPickersDay-root": {
                    fontSize: "0.875rem",
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Card>

          {/* Appointment Details */}
          <Card
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: "1.125rem", fontWeight: 700, mb: 2 }}
            >
              Appointment Details
            </Typography>
            {selectedAppointment ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                  >
                    Patient
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    {selectedAppointment.patientName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                  >
                    Date & Time
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    {formatAppointmentDateTime(selectedAppointment)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                  >
                    Status
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "success.main",
                      }}
                    />
                    <Typography sx={{ fontWeight: 500 }}>Confirmed</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                  >
                    Reason for Visit
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    {selectedAppointment.type}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                  >
                    SMS Reminder
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    Reminder Scheduled ({getReminderTimestamp(selectedAppointment)})
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<EditCalendar />}
                    fullWidth
                    sx={{
                      height: 36,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textTransform: "none",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Sms />}
                    fullWidth
                    sx={{
                      height: 36,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textTransform: "none",
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    Send SMS Reminder
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    fullWidth
                    sx={{
                      height: 36,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textTransform: "none",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      borderColor: "error.main",
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.2)",
                        borderColor: "error.main",
                      },
                    }}
                  >
                    Cancel Appointment
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  py: 4,
                }}
              >
                Select an appointment to view details
              </Typography>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
