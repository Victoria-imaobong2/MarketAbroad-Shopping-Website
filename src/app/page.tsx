import Link from "next/link";
import { prisma } from "@/lib/db";
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import ProductSlideCard from "../components/ProductSlideCard";

export const dynamic = "force-dynamic";

interface ProductItem {
  id: string;
  title: string;
  price: number;
  stock: number;
  images?: string[];
}

export default async function HomePage() {
  let products: ProductItem[] = [];

  try {
    products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      take: 12,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        stock: true,
        images: true,
      },
    });
  } catch (err) {
    console.error("Database lookup deferred on homepage:", err);
  }

  const slidingProducts: ProductItem[] =
    products.length > 0 ? [...products, ...products] : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Sparkles size={14} /> Curated Gifts & Authentic Treasures Delivered
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
          Realms Gifts
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Delight your loved ones across borders. Shop premium gift bundles, curated hampers, everyday favorites, and authentic African essentials with swift international dispatch.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/catalog"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition flex items-center gap-2 shadow-sm"
          >
            <span>Explore Gift Catalog</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/cart"
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-200 rounded-xl text-sm transition flex items-center gap-2"
          >
            <ShoppingBag size={16} />
            <span>View Cart</span>
          </Link>
        </div>
      </section>

      {/* Interactive Infinite Sliding Showcase */}
      <section className="py-8 bg-white border-y border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Featured Gifts & Packages</h2>
            <p className="text-xs text-slate-500">Hover over any product to pause the carousel</p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            See all ({products.length}) <ArrowRight size={12} />
          </Link>
        </div>

        {slidingProducts.length > 0 ? (
          <div className="overflow-hidden w-full py-2">
            <div className="animate-marquee gap-4 px-4">
              {slidingProducts.map((product, index) => (
                <ProductSlideCard key={`${product.id}-${index}`} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-sm text-slate-400">
            No items available right now. Check back shortly.
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Worldwide Gift Dispatch</h3>
            <p className="text-xs text-slate-500 mt-1">
              Carefully wrapped and packed to ensure pristine delivery overseas.
            </p>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Secure Checkout</h3>
            <p className="text-xs text-slate-500 mt-1">
              Direct card and mobile payments powered securely via Paystack.
            </p>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Photo Proof-of-Delivery</h3>
            <p className="text-xs text-slate-500 mt-1">
              Receive live delivery confirmation photos when your package arrives.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}