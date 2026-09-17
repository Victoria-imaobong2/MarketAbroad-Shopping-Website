import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title, description, price, stock, imageUrl, colors, sizes } = await req.json();

    if (!title || !price || !stock) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description: description || "Quality marketplace item",
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        images: imageUrl ? [imageUrl] : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
        variants: {
          create: (colors || ["Default"]).flatMap((color: string) =>
            (sizes || ["Standard"]).map((size: string) => ({
              color,
              size,
              stock: Math.floor(parseInt(stock, 10) / ((colors?.length || 1) * (sizes?.length || 1))),
            }))
          ),
        },
      },
      include: { variants: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to create product" }, { status: 500 });
  }
}