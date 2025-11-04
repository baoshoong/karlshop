import DeleteButton from "@/components/DeleteButton";
import Price from "@/components/Price";
import { ProductType } from "@/types/types";
import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";

const LikeViewComment = dynamic(() => import("@/components/LikeViewComment"), {
  ssr: false,
});

const getData = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

const SingleProductPage = async ({ params }: { params: { id: string } }) => {
  const singleProduct: ProductType = await getData(params.id);

  return (
    <div className="p-6 sm:p-10 md:px-16 lg:px-24 xl:px-32 bg-orange-50 min-h-screen text-blue-900 font-sans">
      {/* Chi tiết sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start border-b border-orange-200 pb-12">
        {/* Hình ảnh */}
        {singleProduct.img && (
          <div className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-white shadow-xl transition duration-300 hover:shadow-2xl hover:scale-[1.02]">
            <Image
              src={singleProduct.img}
              alt={singleProduct.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        {/* Nội dung */}
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            {singleProduct.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed tracking-wide backdrop-blur-md bg-white/70 rounded-xl p-5 shadow-md border border-orange-100">
            {singleProduct.desc}
          </p>

          <div className="mt-2">
            <Price product={singleProduct} />
          </div>

          <div className="mt-3">
            <DeleteButton id={singleProduct.id} />
          </div>
        </div>
      </div>

      {/* Like + Comment */}
      <div className="mt-14">
        <LikeViewComment productId={singleProduct.id} />
      </div>
    </div>
  );
};

export default SingleProductPage;
