"use client";

import { ReactNode } from "react";
import { Box } from "@mui/material";

import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminProtectedLayoutContent({
  children,
  role,
}: {
  children: ReactNode;
  role: "ADMIN" | "STAFF" | null;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar role={role} />
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
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 5,
            backgroundColor: "background.default",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
