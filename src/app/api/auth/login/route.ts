import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminSecret = process.env.ADMIN_SECRET_KEY;

    if (adminSecret && password === adminSecret) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", adminSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({ success: true, role: "ADMIN" });
    }

    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}