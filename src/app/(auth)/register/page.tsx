"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  Alert,
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const sharedFieldStyles = {
  "& .MuiOutlinedInput-root": {
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#F7F8FA",
    "& fieldset": {
      borderColor: "#E2E8F0",
    },
    "&:hover fieldset": {
      borderColor: "#94A3B8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#005A9C",
      borderWidth: "2px",
    },
    "& input": {
      fontSize: "1rem",
      fontWeight: 400,
    },
    "& input::placeholder": {
      color: "#9ca3af",
      opacity: 1,
    },
  },
} as const;

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      clinicName: "",
      doctorName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      setFormSuccess(null);

      if (value.password !== value.confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }

      setIsSubmitting(true);

      try {
        const supabase = getSupabaseBrowserClient();
        const emailRedirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined;

        const { data, error } = await supabase.auth.signUp({
          email: value.email.trim(),
          password: value.password,
          options: {
            emailRedirectTo,
            data: {
              clinicName: value.clinicName.trim(),
              doctorName: value.doctorName.trim(),
            },
          },
        });

        if (error) {
          throw error;
        }

        form.reset();

        if (data.session) {
          setFormSuccess("Account created. Redirecting...");
          router.push("/");
          return;
        }

        setFormSuccess(
          "Check your inbox to confirm your email, then sign in."
        );

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to create an account. Please try again.";
        setFormError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
        p: 4,
        backgroundColor: "#fff",
      }}
    >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: "1.875rem",
              lineHeight: 1.2,
              textAlign: "center",
              mb: 3,
              color: "text.primary",
            }}
          >
            Create Account
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {formError && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {formError}
              </Alert>
            )}
            {formSuccess && (
              <Alert severity="success" sx={{ mb: 1 }}>
                {formSuccess}
              </Alert>
            )}
            <form.Field name="clinicName">
              {(field) => (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    component="label"
                    htmlFor="clinic-name"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      lineHeight: "normal",
                      pb: 1,
                      color: "text.primary",
                    }}
                  >
                    Clinic Name
                  </Typography>
                  <TextField
                    id="clinic-name"
                    type="text"
                    placeholder="Enter your clinic&apos;s name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                    fullWidth
                    sx={sharedFieldStyles}
                  />
                </Box>
              )}
            </form.Field>

            <form.Field name="doctorName">
              {(field) => (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    component="label"
                    htmlFor="doctor-name"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      lineHeight: "normal",
                      pb: 1,
                      color: "text.primary",
                    }}
                  >
                    Doctor&apos;s Full Name
                  </Typography>
                  <TextField
                    id="doctor-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                    fullWidth
                    sx={sharedFieldStyles}
                  />
                </Box>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    component="label"
                    htmlFor="email"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      lineHeight: "normal",
                      pb: 1,
                      color: "text.primary",
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                    fullWidth
                    sx={sharedFieldStyles}
                  />
                </Box>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    component="label"
                    htmlFor="password"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      lineHeight: "normal",
                      pb: 1,
                      color: "text.primary",
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                    fullWidth
                    sx={sharedFieldStyles}
                  />
                </Box>
              )}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    component="label"
                    htmlFor="confirm-password"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      lineHeight: "normal",
                      pb: 1,
                      color: "text.primary",
                    }}
                  >
                    Confirm Password
                  </Typography>
                  <TextField
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                    fullWidth
                    sx={sharedFieldStyles}
                  />
                </Box>
              )}
            </form.Field>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                height: "48px",
                fontSize: "1rem",
                fontWeight: 600,
                backgroundColor: "#005A9C",
                "&:hover": {
                  backgroundColor: "rgba(0, 90, 156, 0.9)",
                },
                mt: 1,
              }}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>

            <Typography
              sx={{
                textAlign: "center",
                fontSize: "0.95rem",
                color: "#6b7280",
                mt: 1,
              }}
            >
              Already have an account?{" "}
              <Link
                component={NextLink}
                href="/login"
                sx={{
                  fontWeight: 600,
                  color: "#005A9C",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
    </Card>
  );
}


