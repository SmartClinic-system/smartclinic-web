"use client";

import { useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import SmartClinicLogo from "../components/SmartClinicLogo";
import Footer from "../components/Footer";

export default function RegisterPage() {
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up attempt:", {
      clinicName,
      doctorName,
      email,
      password,
      confirmPassword,
    });
  };

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

  const renderField = (
    id: string,
    label: string,
    placeholder: string,
    value: string,
    onChange: (value: string) => void,
    type: string = "text"
  ) => (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography
        component="label"
        htmlFor={id}
        sx={{
          fontSize: "0.875rem",
          fontWeight: 500,
          lineHeight: "normal",
          pb: 1,
          color: "text.primary",
        }}
      >
        {label}
      </Typography>
      <TextField
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        fullWidth
        sx={sharedFieldStyles}
      />
    </Box>
  );

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
      <Box sx={{ width: "100%", maxWidth: "28rem" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <SmartClinicLogo size="medium" />
        </Box>

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
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {renderField(
              "clinic-name",
              "Clinic Name",
              "Enter your clinic's name",
              clinicName,
              setClinicName
            )}
            {renderField(
              "doctor-name",
              "Doctor's Full Name",
              "Enter your full name",
              doctorName,
              setDoctorName
            )}
            {renderField(
              "email",
              "Email Address",
              "Enter your email address",
              email,
              setEmail
            )}
            {renderField(
              "password",
              "Password",
              "Create a strong password",
              password,
              setPassword,
              "password"
            )}
            {renderField(
              "confirm-password",
              "Confirm Password",
              "Confirm your password",
              confirmPassword,
              setConfirmPassword,
              "password"
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
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
              Sign Up
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

        <Footer />
      </Box>
    </Box>
  );
}


