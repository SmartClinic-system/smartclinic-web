import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminProtectedLayoutContent from "@/components/AdminProtectedLayoutContent";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/adminSession";

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

  return (
    <AdminProtectedLayoutContent>{children}</AdminProtectedLayoutContent>
  );
}
