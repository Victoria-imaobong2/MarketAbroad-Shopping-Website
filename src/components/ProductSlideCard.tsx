"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { Plus, Check } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  images?: string[];
}

interface CartItem extends Product {
  quantity: number;
}

interface CartStoragePayload {
  state?: {
    cart?: CartItem[];
  };
}

export default function ProductSlideCard({ product }: { readonly product: Product }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem("cart-storage");
      const currentCart: CartStoragePayload = stored ? JSON.parse(stored) : { state: { cart: [] } };
      const items: CartItem[] = currentCart.state?.cart ?? [];
      const existing = items.find((item) => item.id === product.id);

      let updatedItems: CartItem[];
      if (existing) {
        updatedItems = items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedItems = [...items, { ...product, quantity: 1 }];
      }

      localStorage.setItem(
        "cart-storage",
        JSON.stringify({
          ...currentCart,
          state: {
            ...currentCart.state,
            cart: updatedItems,
          },
        })
      );

      window.dispatchEvent(new Event("storage"));
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Cart update error:", err);
    }
  };

  const imageSrc =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80";

  return (
    <Link
      href={`/catalog?product=${product.id}`}
      className="group relative flex flex-col justify-between w-64 bg-white border border-slate-200 rounded-2xl p-3 shrink-0 shadow-sm hover:shadow-md transition duration-200 hover:-translate-y-1"
    >
      <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden mb-3">
        <img
          src={imageSrc}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 shadow-xs">
          ₦{product.price.toLocaleString()}
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
          {product.title}
        </h4>
        <p className="text-[11px] text-slate-500 font-medium">
          {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          }`}
        >
          {added ? (
            <>
              <Check size={14} /> Added
            </>
          ) : (
            <>
              <Plus size={14} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
}