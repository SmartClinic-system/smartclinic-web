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
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthApiError } from "@supabase/supabase-js";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const form = useForm({
    defaultValues: {
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
        const normalizedEmail = value.email.trim().toLowerCase();

        const existsResponse = await fetch(
          `/api/patient/email-exists?email=${encodeURIComponent(
            normalizedEmail
          )}`
        );

        if (!existsResponse.ok) {
          throw new Error("Unable to verify email. Please try again.");
        }

        const { exists } = await existsResponse.json();

        if (exists) {
          setFormError(
            "An account with this email already exists. Please sign in instead."
          );
          setIsSubmitting(false);
          return;
        }

        const supabase = getSupabaseBrowserClient();
        const emailRedirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined;

        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: value.password,
          options: {
            emailRedirectTo,
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

        setFormSuccess("Check your inbox to confirm your email, then sign in.");
      } catch (error) {
        let message = "Unable to create an account. Please try again.";

        if (error instanceof AuthApiError && error.status === 400) {
          message =
            error.message === "User already registered"
              ? "This email is already registered. Please sign in instead."
              : error.message;
        } else if (error instanceof Error) {
          message = error.message;
        }

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
        Create Patient Account
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
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                required
                fullWidth
                sx={sharedFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        sx={{
                          color: "#6b7280",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                required
                fullWidth
                sx={sharedFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle confirm password visibility"
                        onClick={handleToggleConfirmPasswordVisibility}
                        edge="end"
                        sx={{
                          color: "#6b7280",
                        }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
