import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email query parameter is required." },
      { status: 400 }
    );
  }

  const profile = await prisma.patientProfile.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });

  return NextResponse.json({ exists: Boolean(profile) });
}
