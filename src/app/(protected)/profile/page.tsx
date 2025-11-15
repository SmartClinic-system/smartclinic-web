"use client";

import { Box, Typography, Button } from "@mui/material";
import NextLink from "next/link";
import PatientSidebar from "@/components/PatientSidebar";

export default function PatientProfilePlaceholder() {
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
          Profile tools coming soon
        </Typography>
        <Typography sx={{ color: "text.secondary", maxWidth: 520 }}>
          Soon you&apos;ll be able to update your personal details, insurance,
          and notification preferences right from here. We appreciate your
          patience while we finish this experience.
        </Typography>
        <Button component={NextLink} href="/" variant="outlined">
          Back to dashboard
        </Button>
      </Box>
    </Box>
  );
}


