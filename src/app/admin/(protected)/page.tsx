"use client";

import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  Link,
  Divider,
  Grid,
  List,
  ListItem,
  Button,
} from "@mui/material";
import { Add, PersonAdd, Sms } from "@mui/icons-material";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

export default function AdminDashboardPage() {
  const appointments = [
    {
      id: 1,
      name: "Liam Johnson",
      time: "09:00 AM",
      type: "Annual Check-up",
      status: "Upcoming",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCTlRaOrehfynwbcBVyFG6QPDyBo0szAK3DVeuS1ThT-KzoOz7Uf8VxNnGNTK5yp-Iv_QRGz7Vj1hiuaXjwRzEAdpY4ycb7PN1RYQp8zHM01ALpnRnKcvpL6snqxgKQ86vwtwzv0eE0ppYlme2w1S200CYyAkNXzL3p-MWcafuSuCNIzKi4yUG_N365Kph72GWbEGG0gYMkh0TtGdJoqXzXnSzJNqCCIH6u0nCpMatf2fKfbefn8asR38XFX_HXVCRHsVnV6Cyc1aQ",
    },
    {
      id: 2,
      name: "Olivia Chen",
      time: "10:30 AM",
      type: "Follow-up",
      status: "Checked-in",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAgKcDBt-nVE_kkbxvk4U14H-GNVNxVtg4eu_cG2xUsY4Xj5kZF5u3VMZ6ud2lXClOGwPxWJyCJ3ZpzMJG0mXYWyadWj4GY7QTYnTufMwYhtr0J5IxesZrT09Xi2jLByxnzpxlfjAKZjucUbSK0Zmpb82Xzc77wA8RCB6Whc1odlFHRd-qB_XdDfd0sohNlacuBokjL1h3Bdw6hg6n_Na3W1SaJ8B71hgzh46H_E3eMo3Koyvmm8BXgmdOpaxr_JKr2RnsUYcATwhU",
    },
    {
      id: 3,
      name: "Noah Patel",
      time: "11:15 AM",
      type: "Consultation",
      status: "Upcoming",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuANqtmcv8tvs-Q4Rr82gQhS5xi5XQ-f5P2pDf74KG29Igx-ogpHNhrl4hFLA-OjPpaqAiqwwKnibcivtsvlI_mYHnloHxgzGD5q0P03nq1W0UprB8JH6jn1yyfOJszN6U7sc7KvbdBwzFPtguAsj9ceZQx2JlPq9uWPkltZv5s6RJAuEAdv3yl8rKeiNjworNaOF7H9DM1XpEba2RbD_pbxVIi2V0ynPfL0txwGWDfddz3MTMhb8xkuCdJYRTijy3CuTFfkCp6hA8w",
    },
  ];

  const newPatients = [
    { name: "Emma Rodriguez", link: "#" },
    { name: "James Wilson", link: "#" },
    { name: "Sophia Garcia", link: "#" },
  ];

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
    if (status === "Checked-in") return "success";
    if (status === "Upcoming") return "warning";
    return "default";
  };

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
        <AdminHeader />

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 5,
            backgroundColor: "background.default",
          }}
        >
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
                    14
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
                    3
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
                    Unread Messages
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: "1.875rem",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    5
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
                  {appointments.map((appointment, index) => (
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={appointment.avatar}
                            alt={`Profile picture of ${appointment.name}`}
                            sx={{ width: 40, height: 40 }}
                          />
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
                              appointment.status === "Checked-in"
                                ? "rgba(80, 227, 194, 0.2)"
                                : "rgba(245, 166, 35, 0.2)",
                            color:
                              appointment.status === "Checked-in"
                                ? "success.main"
                                : "warning.main",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                          }}
                        />
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </Card>
            </Grid>

            {/* Sidebar */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {/* Quick Actions */}
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
                    Quick Actions
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      fullWidth
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        py: 1.25,
                      }}
                    >
                      Book New Appointment
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PersonAdd />}
                      fullWidth
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        py: 1.25,
                        borderColor: "primary.main",
                        color: "primary.main",
                        backgroundColor: "rgba(19, 127, 236, 0.2)",
                        "&:hover": {
                          backgroundColor: "rgba(19, 127, 236, 0.3)",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      Register New Patient
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Sms />}
                      fullWidth
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        py: 1.25,
                        borderColor: "primary.main",
                        color: "primary.main",
                        backgroundColor: "rgba(19, 127, 236, 0.2)",
                        "&:hover": {
                          backgroundColor: "rgba(19, 127, 236, 0.3)",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      Send SMS Broadcast
                    </Button>
                  </Box>
                </Card>

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
                    {newPatients.map((patient, index) => (
                      <Box key={patient.name}>
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
                              href={patient.link}
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
                    ))}
                  </List>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}


