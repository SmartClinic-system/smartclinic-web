"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import PatientHeader from "@/components/PatientHeader";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    const evaluateSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      if (error || !data.session) {
        setIsAuthenticated(false);
        router.replace("/login");
        setIsChecking(false);
        return;
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    };

    void evaluateSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      if (!session) {
        setIsAuthenticated(false);
        setIsChecking(false);
        router.replace("/login");
        return;
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

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
