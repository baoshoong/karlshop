import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  // Lấy sản phẩm được xem nhiều nhất (mostViewedProduct)
  const [mostViewedProduct] = await prisma.$queryRaw<any[]>`
    SELECT p.* FROM "Product" p
    WHERE p.id IN (
      SELECT "productId" FROM "ProductView" GROUP BY "productId" ORDER BY COUNT(*) DESC LIMIT 1
    )
    LIMIT 1
  `;

  // Lấy sản phẩm rẻ nhất
  const cheapestProduct = await prisma.product.findFirst({
    orderBy: { price: "asc" },
    include: {
      category: true,
    },
  });

  // Lấy sản phẩm đắt nhất
  const mostExpensiveProduct = await prisma.product.findFirst({
    orderBy: { price: "desc" },
    include: {
      category: true,
    },
  });

  // Lấy sản phẩm được yêu thích nhất (mostLikedProduct)
  const [mostLikedProduct] = await prisma.$queryRaw<any[]>`
    SELECT p.* FROM "Product" p
    WHERE p.id IN (
      SELECT "productId" FROM "ProductLike" GROUP BY "productId" ORDER BY COUNT(*) DESC LIMIT 1
    )
    LIMIT 1
  `;

  return NextResponse.json({
    mostViewedProduct: mostViewedProduct ?? null,
    cheapestProduct: cheapestProduct ?? null,
    mostExpensiveProduct: mostExpensiveProduct ?? null,
    mostLikedProduct: mostLikedProduct ?? null,
  });
};
