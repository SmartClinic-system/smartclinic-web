"use client";

import { useState } from "react";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import AdminSidebar from "@/components/AdminSidebar";

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  type: string;
  date: number;
  color: "amber" | "green" | "gray";
}

const appointments: Appointment[] = [
  {
    id: 1,
    patientName: "Liam Gallagher",
    time: "9:00 AM - Check-up",
    type: "Check-up",
    date: 4,
    color: "amber",
  },
  {
    id: 2,
    patientName: "Olivia Chen",
    time: "11:30 AM - Consultation",
    type: "Consultation",
    date: 5,
    color: "green",
  },
  {
    id: 3,
    patientName: "Noah Patel",
    time: "2:00 PM - Follow-up",
    type: "Follow-up",
    date: 7,
    color: "green",
  },
  {
    id: 4,
    patientName: "Ava Rodriguez",
    time: "10:00 AM - Annual Physical",
    type: "Annual Physical",
    date: 9,
    color: "gray",
  },
];

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs("2024-10-05"));
  const [viewMode, setViewMode] = useState<"Daily" | "Weekly" | "Monthly">(
    "Weekly"
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(
      appointments.find((apt) => apt.date === 5) || null
    );

  const getColorStyles = (color: string) => {
    const colors: Record<
      string,
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

  const getAppointmentsForDate = (date: number) => {
    return appointments.filter((apt) => apt.date === date);
  };

  const isToday = (date: number) => {
    return date === 5; // Current date in the example
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setCurrentDate(newDate);
      const dateNum = newDate.date();
      const apt = appointments.find((a) => a.date === dateNum);
      setSelectedAppointment(apt || null);
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  // Generate calendar days for October 2024
  const startOfMonth = dayjs("2024-10-01").startOf("month");
  const endOfMonth = dayjs("2024-10-01").endOf("month");
  const startDate = startOfMonth.startOf("week");
  const days: (number | null)[] = [];

  // Add days from previous month
  for (let i = 0; i < startOfMonth.day(); i++) {
    const prevMonthDate = startOfMonth.subtract(startOfMonth.day() - i, "day");
    days.push(prevMonthDate.date());
  }

  // Add days from current month
  for (let i = 1; i <= endOfMonth.date(); i++) {
    days.push(i);
  }

  // Fill remaining days to complete the grid
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(i);
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AdminSidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{ flex: 1, overflow: "auto", p: 3, backgroundColor: "#F9FAFB" }}
        >
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
                sx={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.2 }}
              >
                Appointments
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 0.5, color: "text.secondary" }}
              >
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
                  <IconButton
                    size="small"
                    onClick={() =>
                      setCurrentDate(currentDate.subtract(1, "month"))
                    }
                  >
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
                  <IconButton
                    size="small"
                    onClick={() => setCurrentDate(currentDate.add(1, "month"))}
                  >
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
                    onClick={() => setCurrentDate(dayjs())}
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

              {/* Calendar Grid */}
              <Box sx={{ flex: 1, mt: 2 }}>
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
                  {days.map((day, index) => {
                    const isCurrentMonth =
                      index >= startOfMonth.day() &&
                      day !== null &&
                      day <= endOfMonth.date();
                    const dayAppointments = day
                      ? getAppointmentsForDate(day)
                      : [];
                    const isCurrentDay = day ? isToday(day) : false;

                    return (
                      <Box
                        key={index}
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
                        {day && (
                          <>
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
                                {day}
                              </Box>
                            ) : (
                              <Typography
                                sx={{ fontSize: "0.875rem", mb: 0.5 }}
                              >
                                {day}
                              </Typography>
                            )}
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
                                      opacity: 0.8,
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
                                    {apt.time}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </>
                        )}
                      </Box>
                    );
                  })}
                </Box>
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
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
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
                        Saturday, Oct 5, 2024 at 11:30 AM
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                      >
                        Status
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "success.main",
                          }}
                        />
                        <Typography sx={{ fontWeight: 500 }}>
                          Confirmed
                        </Typography>
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
                        Routine Consultation
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
                        Reminder Sent (Oct 4, 10:00 AM)
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
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
                    sx={{ color: "text.secondary", textAlign: "center", py: 4 }}
                  >
                    Select an appointment to view details
                  </Typography>
                )}
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
