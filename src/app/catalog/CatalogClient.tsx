"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

interface Variant {
  id: string;
  color: string | null;
  size: string | null;
  stock: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  images: string[];
  variants: Variant[];
}

export default function CatalogClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const addItem = useCartStore((state) => state.addItem);

  // Fallback items if database has no records yet
  const fallbackProducts: Product[] = [
    {
      id: "demo-1",
      title: "Casual Denim Jacket",
      price: 45000,
      stock: 12,
      images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500"],
      variants: [
        { id: "v1", color: "Classic Blue", size: "M", stock: 6 },
        { id: "v2", color: "Faded Wash", size: "L", stock: 6 },
      ],
    },
    {
      id: "demo-2",
      title: "Minimalist Sneakers",
      price: 32000,
      stock: 8,
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
      variants: [
        { id: "v3", color: "White", size: "42", stock: 4 },
        { id: "v4", color: "Midnight Blue", size: "43", stock: 4 },
      ],
    },
    {
      id: "demo-3",
      title: "Canvas Travel Duffel",
      price: 28000,
      stock: 0,
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
      variants: [
        { id: "v5", color: "Navy", size: "Standard", stock: 0 },
      ],
    },
  ];

  const products = initialProducts.length > 0 ? initialProducts : fallbackProducts;

  const [selections, setSelections] = useState<
    Record<string, { color: string; size: string }>
  >({});

  const handleSelect = (productId: string, field: "color" | "size", value: string) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [field]: value,
      },
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const availableColors = Array.from(
          new Set(product.variants.map((v) => v.color).filter(Boolean))
        ) as string[];

        const availableSizes = Array.from(
          new Set(product.variants.map((v) => v.size).filter(Boolean))
        ) as string[];

        const defaultColor = availableColors[0] || "Standard";
        const defaultSize = availableSizes[0] || "One Size";

        const selectedColor = selections[product.id]?.color || defaultColor;
        const selectedSize = selections[product.id]?.size || defaultSize;

        const isAvailable = product.stock > 0;
        const displayImage =
          product.images && product.images[0]
            ? product.images[0]
            : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";

        return (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
          >
            <div className="relative w-full h-56 bg-slate-100">
              <img
                src={displayImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h2 className="font-semibold text-slate-900">{product.title}</h2>
                  <span className="font-bold text-blue-600">
                    ₦{product.price.toLocaleString()}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {isAvailable ? `${product.stock} In Stock` : "Out of Stock"}
                </span>
              </div>

              {/* Preferences Selection */}
              <div className="space-y-3 pt-2">
                {availableColors.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-slate-500 block mb-1">
                      Color
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleSelect(product.id, "color", color)}
                          className={`text-xs px-2.5 py-1 rounded-md border transition ${
                            selectedColor === color
                              ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {availableSizes.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-slate-500 block mb-1">
                      Size
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSelect(product.id, "size", size)}
                          className={`text-xs px-2.5 py-1 rounded-md border transition ${
                            selectedSize === size
                              ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  addItem({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: displayImage,
                    color: selectedColor,
                    size: selectedSize,
                    quantity: 1,
                  })
                }
                disabled={!isAvailable}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg text-xs transition"
              >
                {isAvailable ? "Add to Cart" : "Unavailable"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}