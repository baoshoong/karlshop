import { ProductType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const getData = async (): Promise<ProductType[]> => {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Không thể tải dữ liệu sản phẩm");
  const data = await res.json();
  return data.products;
};

const Featured = async () => {
  const featuredProducts: ProductType[] = await getData();

  return (
    <div className="w-screen overflow-x-scroll text-blue-900 bg-white py-4">
      <div className="w-max flex gap-6 px-4">
        {featuredProducts.map((item) => (
          <Link
            href={`/product/${item.id}`}
            key={item.id}
            className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 bg-white rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 md:w-[50vw] xl:w-[33vw] xl:h-[90vh]"
          >
            {item.img && (
              <div className="relative flex-1 w-full hover:rotate-[4deg] transition-all duration-500">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-2">
              <h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl text-blue-900">
                {item.title}
              </h1>
              <span className="text-xl font-bold text-orange-500">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(Number(item.price))}
              </span>
              <button className="bg-orange-500 text-white py-2 px-4 rounded-md shadow hover:bg-orange-600">
                Thêm vào giỏ hàng
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Featured;