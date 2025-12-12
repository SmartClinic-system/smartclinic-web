"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Link,
  Divider,
  Grid,
  List,
  ListItem,
  CircularProgress,
} from "@mui/material";

type Appointment = {
  id: string;
  name: string;
  time: string;
  type: string;
  status: string;
  originalStatus: string;
};

type Patient = {
  id: string;
  name: string;
};

type DashboardData = {
  appointmentsTodayCount: number;
  newPatientsThisWeekCount: number;
  todaysAppointments: Appointment[];
  newPatientsThisWeek: Patient[];
};

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${days[today.getDay()]}, ${
      months[today.getMonth()]
    } ${today.getDate()}`;
  };

  const getStatusColor = (status: string) => {
    if (status === "Upcoming") return "warning";
    if (status === "Rejected" || status === "Cancelled") return "default";
    return "default";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !dashboardData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {error || "Failed to load dashboard data"}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Page Heading */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: "2.25rem",
            fontWeight: 900,
            lineHeight: 1.2,
            letterSpacing: "-0.033em",
            mb: 0.5,
          }}
        >
          Good Morning, Dr. Anya!
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1rem", color: "text.secondary" }}
        >
          {getCurrentDate()}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontSize: "1rem", fontWeight: 500 }}
              >
                Appointments Today
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontSize: "1.875rem",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {dashboardData.appointmentsTodayCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontSize: "1rem", fontWeight: 500 }}
              >
                New Patients
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontSize: "1.875rem",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {dashboardData.newPatientsThisWeekCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Today's Appointments */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: "1.375rem",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.015em",
                px: 3,
                pt: 3,
                pb: 1.5,
              }}
            >
              Today&apos;s Appointments
            </Typography>
            <List>
              {dashboardData.todaysAppointments.length === 0 ? (
                <ListItem>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", py: 2 }}
                  >
                    No appointments scheduled for today
                  </Typography>
                </ListItem>
              ) : (
                dashboardData.todaysAppointments.map((appointment, index) => (
                  <Box key={appointment.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        py: 3,
                        px: 3,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                        >
                          {appointment.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.875rem",
                            color: "text.secondary",
                          }}
                        >
                          {appointment.time} - {appointment.type}
                        </Typography>
                      </Box>
                      <Chip
                        label={appointment.status}
                        color={
                          getStatusColor(appointment.status) as
                            | "success"
                            | "warning"
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            appointment.status === "Upcoming"
                              ? "rgba(245, 166, 35, 0.2)"
                              : "rgba(0, 0, 0, 0.1)",
                          color:
                            appointment.status === "Upcoming"
                              ? "warning.main"
                              : "text.secondary",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </ListItem>
                  </Box>
                ))
              )}
            </List>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* New Patient Registrations */}
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                p: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "1.125rem", fontWeight: 700, mb: 2 }}
              >
                New Patient Registrations
              </Typography>
              <List>
                {dashboardData.newPatientsThisWeek.length === 0 ? (
                  <ListItem>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", py: 2 }}
                    >
                      No new patients this week
                    </Typography>
                  </ListItem>
                ) : (
                  dashboardData.newPatientsThisWeek.map((patient, index) => (
                    <Box key={patient.id}>
                      {index > 0 && <Divider sx={{ my: 1 }} />}
                      <ListItem disablePadding>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.875rem", fontWeight: 500 }}
                          >
                            {patient.name}
                          </Typography>
                          <Link
                            href={`/admin/patients/${patient.id}`}
                            sx={{
                              fontSize: "0.875rem",
                              color: "primary.main",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            View Profile
                          </Link>
                        </Box>
                      </ListItem>
                    </Box>
                  ))
                )}
              </List>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
