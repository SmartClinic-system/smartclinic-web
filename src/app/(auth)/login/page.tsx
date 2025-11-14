"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  Alert,
  Box,
  Card,
  TextField,
  Button,
  Link,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import NextLink from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      setFormSuccess(null);
      setIsSubmitting(true);

      try {
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({
          email: value.email.trim(),
          password: value.password,
        });

        if (error) {
          throw error;
        }

        setFormSuccess("Signed in successfully. Redirecting...");
        router.push("/");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to sign in. Please try again.";
        setFormError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
            Secure Sign In
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
            {/* Email Field */}
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
                    Email
                  </Typography>
                  <TextField
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                    fullWidth
                    sx={{
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
                    }}
                  />
                </Box>
              )}
            </form.Field>

            {/* Password Field */}
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
                    placeholder="Enter your password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                    fullWidth
                    sx={{
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
                    }}
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

            {/* Login Button */}
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
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            {/* Secondary Links */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 1,
              }}
            >
              <Link
                href="#"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#005A9C",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot Password?
              </Link>
              <Link
                href="#"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#005A9C",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Need Help?
              </Link>
            </Box>

            <Divider
              sx={{
                my: 3,
                "&::before, &::after": {
                  borderColor: "#E2E8F0",
                },
                color: "#94A3B8",
                fontSize: "0.875rem",
              }}
            >
              New to our platform?
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              component={NextLink}
              href="/register"
              sx={{
                height: "48px",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#005A9C",
                borderColor: "#BFD6EB",
                borderWidth: "1.5px",
                borderRadius: "12px",
                "&:hover": {
                  borderColor: "#005A9C",
                  backgroundColor: "rgba(0, 90, 156, 0.05)",
                },
              }}
            >
              Sign Up for a New Clinic
            </Button>
          </Box>
    </Card>
  );
}
