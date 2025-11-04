import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request, { params }: { params: { id: string } }) => {
  const productId = params.id;

  // Ghi nhận lượt xem
  await prisma.productView.create({
    data: { productId },
  });

  const views = await prisma.productView.count({
    where: { productId },
  });

  return NextResponse.json({ views });
};
