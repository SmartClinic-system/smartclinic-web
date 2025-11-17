"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import {
  usePatientAuthStore,
  type PatientAuthData,
} from "@/stores/patientAuthStore";
import PatientProtectedLayoutContent from "@/components/PatientProtectedLayoutContent";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuthData = usePatientAuthStore((state) => state.setAuthData);
  const clearSession = usePatientAuthStore((state) => state.clearSession);
  const setProfile = usePatientAuthStore((state) => state.setProfile);
  const setProfileLoading = usePatientAuthStore(
    (state) => state.setProfileLoading
  );
  const setPendingRoute = usePatientAuthStore((state) => state.setPendingRoute);
  const pendingRoute = usePatientAuthStore((state) => state.pendingRoute);
  const currentProfile = usePatientAuthStore((state) => state.profile);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    const handleAuthenticated = async (data: PatientAuthData) => {
      if (!data.session) {
        handleUnauthenticated();
        return;
      }

      setAuthData(data);
      await ensureProfile(data.session.user.id);
      setIsAuthenticated(true);
      setIsChecking(false);
    };

    const handleUnauthenticated = () => {
      clearSession();
      setIsAuthenticated(false);
      setIsChecking(false);
      router.replace("/login");
    };

    const ensureProfile = async (patientId: string) => {
      if (currentProfile?.patientId === patientId) {
        return true;
      }

      setProfileLoading(true);
      try {
        const response = await fetch(
          `/api/patient/profile?patientId=${patientId}`
        );

        if (response.status === 404) {
          setProfile(null);
          if (!pendingRoute && pathname !== "/profile") {
            setPendingRoute(pathname);
            router.replace("/profile");
          }
          return false;
        }

        if (!response.ok) {
          console.error("Failed to fetch patient profile");
          return false;
        }

        const { profile } = await response.json();
        setProfile(profile);
        setPendingRoute(null);
        return true;
      } catch (error) {
        console.error("Failed to fetch patient profile", error);
        return false;
      } finally {
        setProfileLoading(false);
      }
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

      await handleAuthenticated(data);
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

      void handleAuthenticated({ session });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [
    router,
    clearSession,
    setAuthData,
    setProfile,
    setProfileLoading,
    pendingRoute,
    pathname,
    setPendingRoute,
    currentProfile?.patientId,
  ]);

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
    <PatientProtectedLayoutContent>{children}</PatientProtectedLayoutContent>
  );
}
