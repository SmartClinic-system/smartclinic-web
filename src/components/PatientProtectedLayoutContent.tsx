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
      <PatientSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <PatientHeader />
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 4,
            backgroundColor: "background.default",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
