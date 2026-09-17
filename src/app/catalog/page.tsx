import { prisma } from "@/lib/db";
import CatalogClient from "./CatalogClient";

export const dynamic = "force-dynamic";

type ProductWithVariants = Awaited<
  ReturnType<typeof prisma.product.findMany<{ include: { variants: true } }>>
>;

export default async function CatalogPage() {
  let products: ProductWithVariants = [];

  try {
    products = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (_err) {
    // Database table empty or not yet seeded
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketplace Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose your size and color preferences for fast delivery.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
          {products.length > 0 ? `${products.length} Products` : "Demo Mode"}
        </span>
      </div>

      <CatalogClient initialProducts={products} />
    </div>
  );
}