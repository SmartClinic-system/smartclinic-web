import { NextResponse } from "next/server";
import argon2 from "argon2";

import prisma from "@/lib/prisma";
import { setAdminSessionCookie } from "@/lib/adminSession";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 },
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username: username.trim() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const passwordMatches = await argon2.verify(admin.password, password);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    setAdminSessionCookie(response, admin.id);
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Unable to process login request." },
      { status: 500 },
    );
  }
}

