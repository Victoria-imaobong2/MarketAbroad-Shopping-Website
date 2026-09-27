import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  return Boolean(token && token === process.env.ADMIN_SECRET_KEY);
}

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Order patch error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}