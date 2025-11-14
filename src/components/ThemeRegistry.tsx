"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3B82F6", // Updated to match appointments page
    },
    success: {
      main: "#50E3C2",
    },
    warning: {
      main: "#F5A623",
    },
    background: {
      default: "#F9FAFB", // background-light
      paper: "#ffffff", // foreground-light
    },
    text: {
      primary: "#111827", // text-light-primary
      secondary: "#6B7280", // text-light-secondary
    },
    divider: "#E5E7EB", // border-light
  },
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
          padding: "12px 24px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#F8F9FA",
            "& fieldset": {
              borderColor: "#DEE2E6",
            },
            "&:hover fieldset": {
              borderColor: "#DEE2E6",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#005A9C",
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#DEE2E6",
          "&.Mui-checked": {
            color: "#005A9C",
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3B82F6", // Updated to match appointments page
    },
    success: {
      main: "#50E3C2",
    },
    warning: {
      main: "#F5A623",
    },
    background: {
      default: "#111827", // background-dark
      paper: "#1F2937", // foreground-dark
    },
    text: {
      primary: "#F9FAFB", // text-dark-primary
      secondary: "#9CA3AF", // text-dark-secondary
    },
    divider: "#374151", // border-dark
  },
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
          padding: "12px 24px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#1f2937",
            "& fieldset": {
              borderColor: "#374151",
            },
            "&:hover fieldset": {
              borderColor: "#374151",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#005A9C",
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#374151",
          "&.Mui-checked": {
            color: "#005A9C",
          },
        },
      },
    },
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // You can add logic here to detect dark mode preference
  const prefersDarkMode = false; // Set to true if you want dark mode by default

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
