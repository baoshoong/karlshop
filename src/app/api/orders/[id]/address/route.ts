import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { address } = await req.json();

  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { address },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Failed to update address", error }), { status: 500 });
  }
}
