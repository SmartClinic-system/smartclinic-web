"use client";

import { useState } from "react";
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
} from "@mui/material";
import { Logout } from "@mui/icons-material";

export default function AdminHeader() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleLogout = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      router.replace("/admin/login");
    } catch (error) {
      console.error("Failed to sign out", error);
      setIsSigningOut(false);
    }

    setAnchorEl(null);
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
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 2, md: 5 },
          py: 1.5,
        }}
      >
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
          }}
        >
          SmartClinic Admin Portal
        </Typography>

        <IconButton
          onClick={handleOpenMenu}
          size="small"
          sx={{ p: 0 }}
          aria-controls={menuOpen ? "admin-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt="Admin avatar"
            src="https://api.dicebear.com/7.x/initials/svg?seed=Admin"
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          id="admin-menu"
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
    </AppBar>
  );
}



