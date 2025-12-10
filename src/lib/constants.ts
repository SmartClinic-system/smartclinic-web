export type AppointmentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export const APPOINTMENT_STATUS_COLORS: Record<
  AppointmentStatus,
  { bg: string; border: string; text: string }
> = {
  APPROVED: { bg: "#e8f5e9", border: "#2e7d32", text: "#1b5e20" },
  PENDING: { bg: "#ffebee", border: "#c62828", text: "#b71c1c" },
  REJECTED: { bg: "#eceff1", border: "#9e9e9e", text: "#616161" },
  CANCELLED: { bg: "#eceff1", border: "#9e9e9e", text: "#616161" },
};
