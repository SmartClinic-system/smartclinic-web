import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminProtectedLayoutContent from "@/components/AdminProtectedLayoutContent";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  getAdminRole,
} from "@/lib/adminSession";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  // Get admin role from database
  const role = await getAdminRole(session.adminId);

  return (
    <AdminProtectedLayoutContent role={role || "ADMIN"}>
      <AdminRouteGuard role={role}>
        {children}
      </AdminRouteGuard>
    </AdminProtectedLayoutContent>
  );
}
