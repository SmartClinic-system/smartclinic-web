"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      setFormSuccess(null);
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: value.username.trim(),
            password: value.password,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message =
            typeof data?.error === "string"
              ? data.error
              : "Unable to sign in. Please try again.";
          throw new Error(message);
        }

        setFormSuccess("Admin access granted. Redirecting...");
        router.push("/admin");
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
    setShowPassword((prev) => !prev);
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
        Admin Secure Sign In
      </Typography>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", mb: 3, color: "text.secondary" }}
      >
        Enter your admin credentials to manage SmartClinic.
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

        <form.Field name="username">
          {(field) => (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                component="label"
                htmlFor="username"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  lineHeight: "normal",
                  pb: 1,
                  color: "text.primary",
                }}
              >
                Admin Username
              </Typography>
              <TextField
                id="username"
                type="text"
                placeholder="Enter admin username"
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

        <form.Field name="password">
          {(field) => (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                component="label"
                htmlFor="admin-password"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  lineHeight: "normal",
                  pb: 1,
                  color: "text.primary",
                }}
              >
                Admin Password
              </Typography>
              <TextField
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
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
          {isSubmitting ? "Signing In..." : "Admin Sign In"}
        </Button>
      </Box>
    </Card>
  );
}
