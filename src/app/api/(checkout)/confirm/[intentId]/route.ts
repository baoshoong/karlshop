import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

export const PUT = async (
  request: Request,
  { params }: { params: { intentId: string } }
) => {
  const { intentId } = params;

  try {
    // 1. Cập nhật trạng thái đơn hàng
    const order = await prisma.order.update({
      where: {
        intent_id: intentId,
      },
      data: { status: "Being prepared!" },
    });

    // 2. Parse danh sách sản phẩm trong đơn hàng (từ JSON)
    const products = order.products as {
      id: string;
      optionTitle?: string;
      quantity: number;
    }[];

    // 3. Duyệt từng sản phẩm và cập nhật tồn kho
    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      // Nếu sản phẩm có options thì cập nhật quantity
      if (product?.options && Array.isArray(product.options)) {
        const updatedOptions = product.options.map((option: any) => {
          if (option.title === item.optionTitle) {
            return {
              ...option,
              quantity: Math.max(0, option.quantity - item.quantity),
            };
          }
          return option;
        });

        await prisma.product.update({
          where: { id: item.id },
          data: {
            options: updatedOptions,
          },
        });
      }
    }

    return new NextResponse(
      JSON.stringify({ message: "Order updated & stock adjusted" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Order update error:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
