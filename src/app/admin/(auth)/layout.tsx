import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminAuthLayoutContent from "@/components/AdminAuthLayoutContent";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  getAdminRole,
} from "@/lib/adminSession";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  // If admin is already authenticated, redirect based on role
  if (session) {
    const role = await getAdminRole(session.adminId);
    // STAFF users should be redirected to calendar, ADMIN users to dashboard
    if (role === "STAFF") {
      redirect("/admin/calendar");
    } else {
      redirect("/admin");
    }
  }

  return <AdminAuthLayoutContent>{children}</AdminAuthLayoutContent>;
}
