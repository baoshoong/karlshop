// app/api/categories/route.ts
import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

// FETCH ALL CATEGORIES with search and pagination
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where: {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
        skip,
        take: limit,
        include: {
          products: {
            select: { id: true }, // Only need id to get length
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.category.count({
        where: {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
      }),
    ]);

    return new NextResponse(
      JSON.stringify({ categories, total, page }),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// Optional POST (test route)
// POST: Tạo mới danh mục
export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const newCategory = await prisma.category.create({
      data: {
        title: body.title,
        desc: body.desc,
        slug: body.slug,
        color: body.color,
        img: body.img,
      },
    });

    return new NextResponse(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return new NextResponse(JSON.stringify({ message: "Tạo danh mục thất bại" }), {
      status: 500,
    });
  }
};

