import Link from "next/link";
import { User, Package, Calendar, Clock, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import type { Order } from "@prisma/client";

function getStatusBadge(status: string) {
  if (status === "DELIVERED") return "bg-emerald-50 text-emerald-700";
  if (status === "PAID") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

export default async function ProfilePage() {
  let orders: Order[] = [];
  try {
    orders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  } catch (_err) {
    // Database empty or not connected
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
          <User size={28} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">User Profile</h1>
          <p className="text-xs text-slate-500">Registered Shopper</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Package size={18} className="text-blue-600" />
          Recent Orders & Tracking
        </h2>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No past orders found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">#{order.id.slice(-8)}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {order.deliveryType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-blue-600">₦{order.total.toLocaleString()}</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}