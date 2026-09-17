import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Truck, Package, Check } from "lucide-react";
import { prisma } from "@/lib/db";

const TRACKING_STEPS = [
  { status: "PENDING", label: "Order Placed", icon: Package },
  { status: "PAID", label: "Payment Confirmed", icon: CheckCircle2 },
  { status: "DISPATCHED", label: "Out for Delivery", icon: Truck },
  { status: "DELIVERED", label: "Delivered", icon: Check },
];

export default async function OrderStatusPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    return notFound();
  }

  const currentStepIndex = TRACKING_STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Order Tracking</h1>
            <p className="text-xs text-slate-500 font-mono">ID: {order.id}</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 w-fit">
            {order.deliveryType === "SAME_DAY" ? "Express Same-Day" : "Standard Delivery"}
          </span>
        </div>

        <div className="py-4">
          <div className="grid grid-cols-4 gap-2 text-center relative">
            {TRACKING_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentStepIndex;

              return (
                <div key={step.status} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition ${
                      isCompleted ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className={`text-[11px] font-semibold ${isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Payment Status:</span>
            <span className="font-semibold text-slate-800">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Reference:</span>
            <span className="font-mono text-slate-800">{order.paymentRef || "Pending"}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-semibold text-blue-600">₦{order.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/catalog"
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}