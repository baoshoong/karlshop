import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

//GET SINGLE PRODUCT
export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    const { id } = params;

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: id
            },
        });
        return new NextResponse(JSON.stringify(product), { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ error: "Something went wrong!" }),
            { status: 500 }
        );
    }
}

//DELETE SINGLE PRODUCT
export const DELETE = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    const { id } = params;
    const session = await getAuthSession()

    if (session?.user.isAdmin) {
        try {
            await prisma.product.delete({
                where: {
                    id: id
                },
            });
            return new NextResponse(JSON.stringify("Product has been deleted!"), { status: 200 });
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


// UPDATE SINGLE PRODUCT
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const session = await getAuthSession();

  if (!session?.user.isAdmin) {
    return new NextResponse(
      JSON.stringify({ error: "You are not allowed!" }),
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        desc: body.desc,
        price: body.price,
        catSlug: body.catSlug,
        img: body.img,
        options: body.options || [],
      },
    });

    return new NextResponse(JSON.stringify(updatedProduct), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ error: "Something went wrong!" }),
      { status: 500 }
    );
  }
};