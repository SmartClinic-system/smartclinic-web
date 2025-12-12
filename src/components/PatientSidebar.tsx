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
  EventAvailable,
  Person,
  AddCircle,
  Dashboard,
} from "@mui/icons-material";
import Image from "next/image";

const drawerWidth = 240;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: <Dashboard sx={{ fontSize: 20 }} /> },
  {
    label: "Appointments",
    path: "/appointments",
    icon: <EventAvailable sx={{ fontSize: 20 }} />,
  },
  { label: "Profile", path: "/profile", icon: <Person sx={{ fontSize: 20 }} /> },
];

export default function PatientSidebar() {
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
      <Box sx={{ px: 1, mb: 2 }}>
        <Image
          src="/smart-clinic-logo.png"
          alt="Smart Clinic"
          width={105}
          height={30}
          priority
          style={{ height: "auto", width: "auto" }}
        />
      </Box>

      <List sx={{ flex: 1, px: 0, mt: 2 }}>
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                sx={{
                  borderRadius: 1.5,
                  backgroundColor: isActive
                    ? "rgba(16, 185, 129, 0.08)"
                    : "transparent",
                  color: isActive ? "success.main" : "text.primary",
                  "&:hover": {
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    color: "success.main",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "success.main" : "text.secondary",
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
        startIcon={<AddCircle />}
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
        Book visit
      </Button>
    </Drawer>
  );
}


