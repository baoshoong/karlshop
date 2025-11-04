import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  const productId = params.id;

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.productLike.findFirst({
    where: {
      productId,
      userId: user.id,
    },
  });

  if (existing) {
    await prisma.productLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.productLike.create({
      data: {
        productId,
        userId: user.id,
      },
    });
  }

  const likes = await prisma.productLike.count({
    where: { productId },
  });

  return NextResponse.json({ likes, liked: !existing });
}
