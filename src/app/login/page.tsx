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
import SmartClinicLogo from "../components/SmartClinicLogo";

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
            mb: 4,
          }}
        >
          <SmartClinicLogo size="medium" />
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
