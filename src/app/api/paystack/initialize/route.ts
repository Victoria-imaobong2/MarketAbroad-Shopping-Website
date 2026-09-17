import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, fullName, address, location, amount, isSameDay, items } = await req.json();

    if (!email || !amount || !items?.length) {
      return NextResponse.json({ error: "Missing required checkout parameters" }, { status: 400 });
    }

    // 1. Create order record in database
    const order = await prisma.order.create({
      data: {
        total: amount,
        deliveryType: isSameDay ? "SAME_DAY" : "STANDARD",
        status: "PENDING",
      },
    });

    const reference = `ORD_${order.id}_${Date.now()}`;

    // 2. Initialize transaction with Paystack
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack requires kobo
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}`,
        metadata: {
          orderId: order.id,
          fullName,
          address,
          location,
          isSameDay,
          itemsCount: items.length,
        },
      }),
    });

    const data = await paystackRes.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    // 3. Attach payment reference to the order
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: reference },
    });

    return NextResponse.json({ authorization_url: data.data.authorization_url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to initialize payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}