"use client";

import { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [useOTP, setUseOTP] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { username, password, useOTP });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 4,
            color: "#0d141b",
          }}
        >
          {/* Clinic Icon SVG */}
          <Box
            component="svg"
            sx={{
              width: 24,
              height: 24,
              color: "#005A9C",
            }}
            fill="currentColor"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
              fillRule="evenodd"
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: "1.25rem",
              lineHeight: 1.2,
              letterSpacing: "-0.015em",
              color: "#0d141b",
            }}
          >
            Clinic EMR System
          </Typography>
        </Box>

        {/* Main Login Form Card */}
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #DEE2E6",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            p: 4,
            backgroundColor: "background.paper",
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
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Username or Email Field */}
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
                Username or Email
              </Typography>
              <TextField
                id="username"
                type="text"
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "48px",
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

            {/* Password Field */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "48px",
                    paddingRight: 0,
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
                          borderLeft: "1px solid #DEE2E6",
                          borderRadius: 0,
                          borderTopRightRadius: "8px",
                          borderBottomRightRadius: "8px",
                          height: "48px",
                          width: "48px",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* OTP Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={useOTP}
                  onChange={(e) => setUseOTP(e.target.checked)}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: "1.25rem",
                    },
                  }}
                />
              }
              label="Use One-Time Password (OTP)"
              sx={{
                py: 1,
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "text.primary",
                },
              }}
            />

            {/* Login Button */}
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
              Sign In
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
          </Box>
        </Card>

        {/* Footer */}
        <Box
          sx={{
            mt: 4,
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
            © 2024 ClinicName. All rights reserved.
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "center",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Link
              href="#"
              sx={{
                fontSize: "0.875rem",
                color: "#6b7280",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              href="#"
              sx={{
                fontSize: "0.875rem",
                color: "#6b7280",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
