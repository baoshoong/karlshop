// ✅ Đây là cách đúng để dùng getServerSession
import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ orders: [] }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: {
      userEmail: session.user.email,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ orders });
};
