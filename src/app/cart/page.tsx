"use client";

import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link
          href="/catalog"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.color}-${item.size}`}
              className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4 shadow-sm"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 truncate">{item.title}</h3>
                <p className="text-xs text-slate-500">
                  Color: <span className="text-slate-700 font-medium">{item.color}</span> | Size:{" "}
                  <span className="text-slate-700 font-medium">{item.size}</span>
                </p>
                <p className="text-xs font-semibold text-blue-600 mt-1">
                  ₦{item.price.toLocaleString()} × {item.quantity}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.id, item.color, item.size)}
                className="text-slate-400 hover:text-red-600 p-2 transition"
                aria-label="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 h-fit space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Order Summary
          </h2>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Delivery</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Calculated at checkout
            </span>
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900">
            <span>Total</span>
            <span className="text-blue-600">₦{subtotal.toLocaleString()}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}