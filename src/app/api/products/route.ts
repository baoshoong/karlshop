// src/app/api/products/route.ts

import { prisma } from "@/utils/connect";
import { getAuthSession } from "@/utils/auth"; // đảm bảo bạn có hàm này
import { NextRequest, NextResponse } from "next/server";

// GET PRODUCTS WITH FILTER, SEARCH, PAGINATION
export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const all = searchParams.get("all");
  const q = searchParams.get("q")?.toLowerCase() || "";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "9");

  const priceFilter: any = {};
  if (minPrice) priceFilter.gte = Number(minPrice);
  if (maxPrice) priceFilter.lte = Number(maxPrice);

  const whereClause: any = {
    ...(cat ? { catSlug: cat } : all === "true" ? {} : { isFeatured: true }),
    ...(q
      ? {
          title: {
            contains: q,
            mode: "insensitive",
          },
        }
      : {}),
    ...(Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {}),
  };

  const skip = (page - 1) * limit;

  try {
    const total = await prisma.product.count({ where: whereClause });

    const products = await prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        title: "asc",
      },
    });

    return new NextResponse(
      JSON.stringify({
        products,
        total,
        page,
        limit,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// POST (ADD NEW PRODUCT)
export const POST = async (req: NextRequest) => {
  const session = await getAuthSession();

  if (!session?.user?.isAdmin) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
  }

  try {
    const body = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        desc: body.desc,
        price: Number(body.price),
        img: body.img,
        catSlug: body.catSlug,
        options: body.options || [],
        isFeatured: body.isFeatured || false, // optional field
      },
    });

    return new NextResponse(JSON.stringify(newProduct), { status: 201 });
  } catch (err) {
    console.error("Create product failed", err);
    return new NextResponse(
      JSON.stringify({ message: "Failed to create product" }),
      { status: 500 }
    );
  }
};
