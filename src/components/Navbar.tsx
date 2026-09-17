"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-blue-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
          Market<span className="text-slate-900">Abroad</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/catalog" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Catalog
          </Link>
          <Link href="/cart" className="relative p-2 text-slate-700 hover:text-blue-600">
            <ShoppingBag size={22} />
            {totalCount > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}