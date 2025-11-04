import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  const productId = params.id;

  const likes = await prisma.productLike.count({
    where: { productId },
  });

  if (!session?.user?.email) {
    return NextResponse.json({ likes, liked: false });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ likes, liked: false });
  }

  const existing = await prisma.productLike.findFirst({
    where: {
      productId,
      userId: user.id,
    },
  });

  return NextResponse.json({ likes, liked: !!existing });
}
