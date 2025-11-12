"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from "@mui/material";
import {
  Dashboard,
  CalendarMonth,
  Groups,
  Chat,
  Settings,
  Add,
  Spa,
} from "@mui/icons-material";

const drawerWidth = 256;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: <Dashboard sx={{ fontSize: 20 }} /> },
  {
    label: "Calendar",
    path: "/calendar",
    icon: <CalendarMonth sx={{ fontSize: 20 }} />,
  },
  {
    label: "Patients",
    path: "/patients",
    icon: <Groups sx={{ fontSize: 20 }} />,
  },
  {
    label: "Messages",
    path: "/messages",
    icon: <Chat sx={{ fontSize: 20 }} />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings sx={{ fontSize: 20 }} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          px: 2,
          py: 3,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1, mb: 3 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 2,
            backgroundColor: "primary.main",
            color: "white",
          }}
        >
          <Spa sx={{ fontSize: 16 }} />
        </Box>
        <Typography variant="h6" sx={{ fontSize: "1.125rem", fontWeight: 700 }}>
          ClinicEMR
        </Typography>
      </Box>

      {/* Doctor Profile */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP7uC6dWbTB1xriEiP7c6sYWwsu1D_b5JiJncDvfei2ghzLHiAKUi9jSmncCvoXafzc3X1GNbGjpdSGdXvbXU-YWbl1lSbrvG-3JV5eZ2CBSRcGQdrBvARo3gIoOMyub6SzHsEVbGbB4p7sMaTj4EwuGsDQuU8qlLRRisqveHBJPSZMuEDBHw2v5c7TYXyc74Ko-ORFJ-1cwNTFs_JhnbGgSPHGN5wyNm7LW4Cx_74PijxOKvbtdjzehQulHGuFhpLyGk5KiEpDkA"
            alt="Profile picture of Dr. Evelyn Reed"
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.875rem", fontWeight: 600 }}
            >
              Dr. Evelyn Reed
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.75rem", color: "text.secondary" }}
            >
              General Practice
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 0, mt: 2 }}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.path || (item.path === "/" && pathname === "/");
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                sx={{
                  borderRadius: 1.5,
                  backgroundColor: isActive
                    ? "rgba(59, 130, 246, 0.1)"
                    : "transparent",
                  color: isActive ? "primary.main" : "text.primary",
                  "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    color: "primary.main",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* New Patient Button */}
      <Button
        variant="contained"
        startIcon={<Add />}
        fullWidth
        sx={{
          mt: "auto",
          textTransform: "none",
          fontSize: "0.875rem",
          fontWeight: 500,
          minWidth: 84,
          height: 40,
        }}
      >
        New Patient
      </Button>
    </Drawer>
  );
}
