"use client";

import { ReactNode } from "react";
import { Box } from "@mui/material";

import PatientHeader from "@/components/PatientHeader";
import PatientSidebar from "@/components/PatientSidebar";

export default function PatientProtectedLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <PatientSidebar />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "background.default",
        }}
      >
        <PatientHeader />
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: { xs: 2, md: 4 },
            maxWidth: "1280px",
            width: "100%",
            mx: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
