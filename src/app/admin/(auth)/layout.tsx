import { Box } from "@mui/material";
import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import SmartClinicLogo from "@/components/SmartClinicLogo";

export default function AdminAuthLayout({
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
          <SmartClinicLogo size="medium" />
        </Box>
        {children}
        <Footer />
      </Box>
    </Box>
  );
}


