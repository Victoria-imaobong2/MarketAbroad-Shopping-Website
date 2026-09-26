import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminSecret = process.env.ADMIN_SECRET_KEY;

    // Check if the input password matches your ADMIN_SECRET_KEY
    if (adminSecret && password === adminSecret) {
      const cookieStore = await cookies();

      cookieStore.set("admin_session", adminSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true, role: "ADMIN" });
    }

    // Default regular user login response
    return NextResponse.json({ success: true, role: "USER" });
  } catch {
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}