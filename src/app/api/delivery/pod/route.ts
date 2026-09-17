import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { orderId, signature } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "DELIVERED",
        podSignature: signature || null,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update order POD";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}