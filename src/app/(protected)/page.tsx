"use client";

import { Box, Typography, Button, Paper } from "@mui/material";
import NextLink from "next/link";

export default function PatientHomePlaceholder() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          maxWidth: 600,
          width: "100%",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Patient dashboard coming soon
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          We&apos;re preparing a personalized patient experience with upcoming
          appointments, reminders, and health insights. Check back soon for the
          new dashboard.
        </Typography>
        <Button component={NextLink} href="/appointments" variant="contained">
          View appointments
        </Button>
      </Paper>
    </Box>
  );
}


