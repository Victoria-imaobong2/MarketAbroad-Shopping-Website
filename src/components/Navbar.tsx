"use client";

import Link from "next/link";
import { ShoppingBag, User, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-slate-900">
          Market<span className="text-blue-600">Abroad</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/catalog"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            Catalog
          </Link>

          

          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition flex items-center gap-1.5"
          >
            <User size={15} />
            <span className="hidden sm:inline">Sign In</span>
          </Link>

          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="View shopping cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}