"use client";

import { Box, Typography, Button } from "@mui/material";
import NextLink from "next/link";
import PatientSidebar from "@/components/PatientSidebar";

export default function PatientAppointmentsPlaceholder() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <PatientSidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
          p: 4,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Appointments coming soon
        </Typography>
        <Typography sx={{ color: "text.secondary", maxWidth: 520 }}>
          We&apos;re building a streamlined experience to view upcoming visits,
          confirm slots, and request new appointments. Please check back later
          while we finalize this feature.
        </Typography>
        <Button component={NextLink} href="/" variant="outlined">
          Return to dashboard
        </Button>
      </Box>
    </Box>
  );
}


