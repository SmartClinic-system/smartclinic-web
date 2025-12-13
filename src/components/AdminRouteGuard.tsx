"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AdminRouteGuardProps {
  children: React.ReactNode;
  role: "ADMIN" | "STAFF" | null;
}

export default function AdminRouteGuard({
  children,
  role,
}: AdminRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // If user is STAFF and trying to access any route other than /admin/calendar, redirect to calendar
    if (role === "STAFF" && pathname !== "/admin/calendar") {
      router.replace("/admin/calendar");
    }
  }, [role, pathname, router]);

  // Don't render children if STAFF user is on wrong route (will redirect)
  if (role === "STAFF" && pathname !== "/admin/calendar") {
    return null;
  }

  return <>{children}</>;
}

