import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client"; // 👈 THÊM DÒNG NÀY

export async function GET(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          {
            name: {
              contains: q,
              mode: Prisma.QueryMode.insensitive, // ✅ dùng Enum đúng kiểu
            },
          },
          {
            email: {
              contains: q,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { emailVerified: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isAdmin: true,
        emailVerified: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total });
}
