// app/api/profile/route.ts
import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, image } = await req.json();

  if (!name || !image) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: { name, image },
  });

  return NextResponse.json(updatedUser);
}
