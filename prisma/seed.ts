import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.create({
    data: {
      title: "Classic Oxford Canvas Shirt",
      description: "Breathable, lightweight cotton blend suitable for casual and semi-formal wear.",
      price: 24000,
      stock: 40,
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"],
      variants: {
        create: [
          { color: "Sky Blue", size: "M", stock: 10 },
          { color: "Sky Blue", size: "L", stock: 10 },
          { color: "Pure White", size: "M", stock: 10 },
          { color: "Pure White", size: "L", stock: 10 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: "Everyday Urban Sneaker",
      description: "Cushioned insole with high-traction rubber soles for maximum all-day support.",
      price: 38500,
      stock: 25,
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
      variants: {
        create: [
          { color: "White/Blue", size: "42", stock: 10 },
          { color: "White/Blue", size: "43", stock: 15 },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });