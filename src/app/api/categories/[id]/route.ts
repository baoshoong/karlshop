// app/api/categories/[id]/route.ts
import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        products: {
          select: { id: true },
        },
      },
    });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(category), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();
    const { title, slug, desc, color, img } = body;

    const updatedCategory = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        slug,
        desc,
        color,
        img,
      },
    });

    return new NextResponse(JSON.stringify(updatedCategory), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await prisma.category.delete({
      where: {
        id: params.id,
      },
    });
    return new NextResponse(JSON.stringify({ message: "Deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
