"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Drawer,
  List,
  ListItemButton,
  Divider,
  Box,
} from "@mui/material";
import {
  Logout,
  Menu as MenuIcon,
  Dashboard,
  EventAvailable,
  Person,
  Close,
} from "@mui/icons-material";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const navItems = [
  { label: "Home", path: "/", icon: <Dashboard fontSize="small" /> },
  {
    label: "Appointments",
    path: "/appointments",
    icon: <EventAvailable fontSize="small" />,
  },
  { label: "Profile", path: "/profile", icon: <Person fontSize="small" /> },
];

export default function PatientHeader() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      router.replace("/login");
    } catch (error) {
      console.error("Failed to sign out", error);
      setIsSigningOut(false);
    }

    setAnchorEl(null);
    setMobileNavOpen(false);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    if (!isSigningOut) {
      setAnchorEl(null);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        width: "100%",
        ml: 0,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open navigation"
          onClick={() => setMobileNavOpen(true)}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 600,
            letterSpacing: "-0.01em",
            flex: 1,
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
          }}
        >
          SmartClinic Patient Portal
        </Typography>

        <IconButton
          onClick={handleOpenMenu}
          size="small"
          sx={{ p: 0 }}
          aria-controls={menuOpen ? "patient-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt="Patient avatar"
            src="https://api.dicebear.com/7.x/initials/svg?seed=Patient"
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          id="patient-menu"
          open={menuOpen}
          onClose={handleCloseMenu}
          onClick={handleCloseMenu}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleLogout} disabled={isSigningOut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {isSigningOut ? "Signing out..." : "Logout"}
            </ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 260,
            p: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Navigation
          </Typography>
          <IconButton onClick={() => setMobileNavOpen(false)} size="small">
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              href={item.path}
              onClick={() => setMobileNavOpen(false)}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <ListItemButton
          onClick={handleLogout}
          disabled={isSigningOut}
          sx={{ borderRadius: 1 }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={isSigningOut ? "Signing out..." : "Logout"} />
        </ListItemButton>
      </Drawer>
    </AppBar>
  );
}
