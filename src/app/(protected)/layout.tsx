"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import PatientHeader from "@/components/PatientHeader";
import {
  usePatientAuthStore,
  type PatientAuthData,
} from "@/stores/patientAuthStore";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuthData = usePatientAuthStore((state) => state.setAuthData);
  const clearSession = usePatientAuthStore((state) => state.clearSession);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    const handleAuthenticated = (data: PatientAuthData) => {
      if (!data.session) {
        handleUnauthenticated();
        return;
      }

      setAuthData(data);
      setIsAuthenticated(true);
      setIsChecking(false);
    };

    const handleUnauthenticated = () => {
      clearSession();
      setIsAuthenticated(false);
      setIsChecking(false);
      router.replace("/login");
    };

    const evaluateSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      if (error || !data.session) {
        handleUnauthenticated();
        return;
      }

      handleAuthenticated(data);
    };

    void evaluateSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      if (!session) {
        handleUnauthenticated();
        return;
      }

      handleAuthenticated({ session });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, clearSession, setAuthData]);

  if (isChecking) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <PatientHeader />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
