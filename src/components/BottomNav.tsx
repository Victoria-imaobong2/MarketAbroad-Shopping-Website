"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function BottomNav() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/catalog", label: "Shop", icon: Compass },
    { href: "/cart", label: "Cart", icon: ShoppingBag, badge: cartCount },
    { href: "/profile", label: "Account", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 sm:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {links.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
                isActive ? "text-blue-600 font-semibold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {Boolean(badge) && (
                  <span className="absolute -top-1.5 -right-2.5 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}