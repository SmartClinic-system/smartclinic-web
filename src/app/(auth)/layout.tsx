"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/Footer";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    const redirectIfAuthenticated = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      if (!error && data.session) {
        router.replace("/");
      }
    };

    void redirectIfAuthenticated();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      if (session) {
        router.replace("/");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

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

