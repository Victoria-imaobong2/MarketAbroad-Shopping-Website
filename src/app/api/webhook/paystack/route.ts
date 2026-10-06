import crypto from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("x-paystack-signature");

  const secret = process.env.PAYSTACK_SECRET_KEY as string;
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

  if (hash !== signature) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 },
    );
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { reference, metadata, customer, amount } = event.data;
    const orderId = metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentRef: reference,
        },
      });

      // Send transactional confirmation via Resend
      try {
        await resend.emails.send({
          from: "customer <onboarding@resend.dev>",
          to: customer.email,
          subject: `Payment Confirmed: Order #${orderId}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #2563eb;">Payment Successful!</h2>
              <p>Your order <strong>#${orderId}</strong> is confirmed.</p>
              <p><strong>Amount Paid:</strong> ₦${(amount / 100).toLocaleString()}</p>
              <p><strong>Reference:</strong> ${reference}</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="color: #64748b; font-size: 13px;">Our logistics team is preparing your package for dispatch.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Resend Email Error:", emailErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
