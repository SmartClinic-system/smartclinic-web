import { Box } from "@mui/material";
import type { ReactNode } from "react";
import SmartClinicLogo from "@/components/SmartClinicLogo";
import Footer from "@/components/Footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
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

