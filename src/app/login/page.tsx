"use client";

import { useState } from "react";
import {
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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SmartClinicLogo from "../components/SmartClinicLogo";
import Footer from "../components/Footer";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { username, password });
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

        <Footer />
      </Box>
    </Box>
  );
}
