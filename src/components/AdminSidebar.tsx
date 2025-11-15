"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import {
  Dashboard,
  CalendarMonth,
  Groups,
  Add,
} from "@mui/icons-material";
import SmartClinicLogo from "./SmartClinicLogo";

export const ADMIN_DRAWER_WIDTH = 256;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/admin", icon: <Dashboard sx={{ fontSize: 20 }} /> },
  {
    label: "Calendar",
    path: "/admin/calendar",
    icon: <CalendarMonth sx={{ fontSize: 20 }} />,
  },
  {
    label: "Patients",
    path: "/admin/patients",
    icon: <Groups sx={{ fontSize: 20 }} />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: ADMIN_DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: ADMIN_DRAWER_WIDTH,
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
      <Box sx={{ px: 1, mb: 3 }}>
        <SmartClinicLogo size="small" />
      </Box>

      <List sx={{ flex: 1, px: 0, mt: 2 }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
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


