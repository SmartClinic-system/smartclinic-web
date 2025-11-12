import { Box, Typography } from "@mui/material";

interface SmartClinicLogoProps {
  variant?: "horizontal" | "vertical";
  size?: "small" | "medium" | "large";
}

export default function SmartClinicLogo({
  variant = "horizontal",
  size = "medium",
}: SmartClinicLogoProps) {
  const sizes = {
    small: { icon: 24, text: "0.875rem", gap: 0.75 },
    medium: { icon: 32, text: "1rem", gap: 1 },
    large: { icon: 48, text: "1.5rem", gap: 1.5 },
  };

  const currentSize = sizes[size];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: currentSize.gap,
        flexDirection: variant === "vertical" ? "column" : "row",
      }}
    >
      {/* Smartphone Icon with Medical Cross and Wi-Fi Signals */}
      <Box
        component="svg"
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        sx={{ flexShrink: 0 }}
      >
        {/* Smartphone Body */}
        <rect
          x="12"
          y="4"
          width="24"
          height="40"
          rx="4"
          fill="url(#phoneGradient)"
        />
        {/* Medical Cross */}
        <path
          d="M24 14V22M20 18H28"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Home Button */}
        <circle cx="24" cy="40" r="2" fill="white" opacity="0.3" />
        {/* Wi-Fi Signals */}
        <g>
          <path
            d="M32 12C32 12 30 14 30 18"
            stroke="url(#wifiGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M36 8C36 8 32 12 32 18"
            stroke="url(#wifiGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M40 4C40 4 34 10 34 18"
            stroke="url(#wifiGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <defs>
          <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="wifiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </Box>

      {/* Text */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: variant === "vertical" ? "center" : "flex-start",
        }}
      >
        {/* SMART Text */}
        <Typography
          sx={{
            fontSize: currentSize.text,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            background: "linear-gradient(90deg, #3B82F6 0%, #EC4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            position: "relative",
            lineHeight: 1.1,
            "&::after": {
              content: '"SMART"',
              position: "absolute",
              top: "2px",
              left: "2px",
              background: "linear-gradient(90deg, #EC4899 0%, #EC4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0.4,
              zIndex: -1,
            },
          }}
        >
          SMART
        </Typography>
        {/* CLINIC Text */}
        <Typography
          sx={{
            fontSize: `calc(${currentSize.text} * 0.9)`,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            background: "linear-gradient(90deg, #3B82F6 0%, #EC4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
            mt: 0.1,
          }}
        >
          CLINIC
        </Typography>
      </Box>
    </Box>
  );
}

