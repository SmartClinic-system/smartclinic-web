"use client";

import { Box, Typography, Button } from "@mui/material";
import NextLink from "next/link";
import PatientSidebar from "@/components/PatientSidebar";

export default function PatientHomePlaceholder() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <PatientSidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Patient dashboard coming soon
        </Typography>
        <Typography sx={{ color: "text.secondary", maxWidth: 480 }}>
          We&apos;re preparing a personalized patient experience with upcoming
          appointments, reminders, and health insights. Check back soon for the
          new dashboard.
        </Typography>
        <Button
          component={NextLink}
          href="/appointments"
          variant="contained"
          sx={{ mt: 1 }}
        >
          View appointments
        </Button>
      </Box>
    </Box>
  );
}


