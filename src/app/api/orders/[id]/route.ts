import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const body = await req.json();

    await prisma.order.update({
      where: { id },
      data: {
        status: body.status, // ✅ chỉ lấy status thôi
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Order has been updated!" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ error: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
console.log("Fetching order with ID:", id);
  try {
    const order = await prisma.order.findUnique({
      where: { id },
    });
    console.log("Order fetched:", order);


    if (!order) {
      return new NextResponse(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(order), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch order" }),
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const session = await getAuthSession();

  if (session?.user.isAdmin) {
    try {
      await prisma.order.delete({
        where: {
          id: id,
        },
      });
      return new NextResponse(JSON.stringify("Order has been deleted!"), { status: 200 });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ error: "Something went wrong!" }),
        { status: 500 }
      );
    }
  }
  return new NextResponse(
    JSON.stringify({ error: "You are not allowed!" }),
    { status: 403 }
  );
};


