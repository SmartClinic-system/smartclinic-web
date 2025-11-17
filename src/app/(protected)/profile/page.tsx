"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm } from "@tanstack/react-form";

import { usePatientAuthStore } from "@/stores/patientAuthStore";

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

export default function PatientProfilePage() {
  const session = usePatientAuthStore((state) => state.session);
  const profile = usePatientAuthStore((state) => state.profile);
  const setProfile = usePatientAuthStore((state) => state.setProfile);
  const setPendingRoute = usePatientAuthStore((state) => state.setPendingRoute);

  const emailFromSession = useMemo(
    () => session?.user?.email ?? "",
    [session?.user?.email]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      dateOfBirth: profile?.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
      gender: profile?.gender ?? "",
      phoneNumber: profile?.phoneNumber ?? "",
      email: profile?.email ?? emailFromSession,
    },
    onSubmit: async ({ value }) => {
      if (!session?.user?.id) {
        setError("Session not found. Please sign in again.");
        return;
      }

      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await fetch("/api/patient/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: session.user.id,
            ...value,
            dateOfBirth: value.dateOfBirth?.format("YYYY-MM-DD") ?? "",
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error ?? "Failed to save profile.");
        }

        const data = await response.json();
        setProfile(data.profile);
        setPendingRoute(null);
        setSuccess("Profile saved successfully.");
      } catch (submitError) {
        const message =
          submitError instanceof Error
            ? submitError.message
            : "Failed to save profile.";
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
          p: 3,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 720, p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Complete Your Profile
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            We need a few more details to finish setting up your account.
          </Typography>

          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <form.Field name="firstName">
                  {(field) => (
                    <TextField
                      label="First Name"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      required
                      fullWidth
                    />
                  )}
                </form.Field>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <form.Field name="lastName">
                  {(field) => (
                    <TextField
                      label="Last Name"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      required
                      fullWidth
                    />
                  )}
                </form.Field>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <form.Field name="dateOfBirth">
                  {(field) => (
                    <DatePicker
                      label="Date of Birth"
                      value={field.state.value}
                      onChange={(date) => field.handleChange(date)}
                      format="MM/DD/YYYY"
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                          onBlur: field.handleBlur,
                        },
                      }}
                    />
                  )}
                </form.Field>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <form.Field name="gender">
                  {(field) => (
                    <TextField
                      label="Gender"
                      select
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      required
                      fullWidth
                    >
                      {genderOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </form.Field>
              </Grid>
              <Grid size={12}>
                <form.Field name="phoneNumber">
                  {(field) => (
                    <TextField
                      label="Phone Number"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      required
                      fullWidth
                    />
                  )}
                </form.Field>
              </Grid>
              <Grid size={12}>
                <form.Field name="email">
                  {(field) => (
                    <TextField
                      label="Email"
                      type="email"
                      value={field.state.value}
                      slotProps={{
                        input: {
                          readOnly: true,
                          disabled: true,
                        },
                      }}
                      required
                      fullWidth
                    />
                  )}
                </form.Field>
              </Grid>
            </Grid>

            <Box
              sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" onClose={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
