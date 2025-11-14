import { Fragment } from "react";
import { Box, Link, Typography } from "@mui/material";

export interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  companyName?: string;
  year?: number;
  links?: FooterLink[];
}

const defaultLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export default function Footer({
  companyName = "Smart Clinic",
  year = new Date().getFullYear(),
  links = defaultLinks,
}: FooterProps) {
  const hasLinks = links.length > 0;

  return (
    <Box
      sx={{
        mt: 4,
        textAlign: "center",
        fontSize: "0.875rem",
        color: "#6b7280",
      }}
    >
      <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
        © {year} {companyName}. All rights reserved.
      </Typography>
      {hasLinks && (
        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "center",
            gap: 1,
            alignItems: "center",
          }}
        >
          {links.map((link, index) => (
            <Fragment key={`${link.label}-${index}`}>
              <Link
                href={link.href}
                sx={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {link.label}
              </Link>
              {index < links.length - 1 && (
                <Typography
                  component="span"
                  sx={{ color: "#9ca3af" }}
                  aria-hidden="true"
                >
                  ·
                </Typography>
              )}
            </Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
}


