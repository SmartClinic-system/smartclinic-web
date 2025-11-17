"use client";

import { Box, Typography, Button, Paper } from "@mui/material";
import NextLink from "next/link";

export default function PatientAppointmentsPlaceholder() {
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
          Appointments coming soon
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          We&apos;re building a streamlined experience to view upcoming visits,
          confirm slots, and request new appointments. Please check back later
          while we finalize this feature.
        </Typography>
        <Button component={NextLink} href="/" variant="outlined">
          Return to dashboard
        </Button>
      </Paper>
    </Box>
  );
}


