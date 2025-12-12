"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function AdminAuthLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8F9FA",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "28rem",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/smart-clinic-logo.png"
            alt="Smart Clinic"
            width={140}
            height={40}
            priority
            style={{ height: "auto", width: "auto" }}
          />
        </Box>
        {children}
        <Footer />
      </Box>
    </Box>
  );
}

