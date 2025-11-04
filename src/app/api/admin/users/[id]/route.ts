import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        isAdmin: true, // 👈 Lấy isAdmin
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy thông tin người dùng" }, { status: 500 });
  }
}

// PUT
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, image, isAdmin } = body;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        image,
        isAdmin, // 👈 Cập nhật isAdmin
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        isAdmin: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Không thể cập nhật người dùng" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.user.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Không thể xoá người dùng" }, { status: 500 });
  }
}
