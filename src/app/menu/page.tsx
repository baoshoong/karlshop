import { MenuType } from "@/types/types";
import Link from "next/link";
import React from "react";

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không thể tải danh mục");
  }

  const data = await res.json();
  return data.categories;
};

const MenuPage = async () => {
  const colorMap = {
    black: "bg-black text-white",
    white: "bg-white text-black",
    red: "bg-red-500 text-white",
    blue: "bg-blue-500 text-white",
    yellow: "bg-yellow-300 text-black",
    green: "bg-green-500 text-white",
    orange: "bg-orange-400 text-black",
  };

  const menu: MenuType = await getData();

  return (
    <div className="px-6 py-10 lg:px-24 xl:px-40 min-h-screen bg-gradient-to-b from-white to-orange-50 text-gray-800">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-14 text-center tracking-tight text-orange-400">
        Khám Phá Danh Mục Sản Phẩm
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {menu.map((category) => (
          <Link
            href={`/menu/${category.slug}`}
            key={category.id}
            className="relative group h-80 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${category.img})` }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition duration-500" />

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white backdrop-blur-sm bg-opacity-30">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold uppercase drop-shadow-md">
                  {category.title}
                </h2>
                <p className="mt-3 text-sm md:text-base line-clamp-3 opacity-90">
                  {category.desc}
                </p>
              </div>

              <button
                className={`mt-4 py-2.5 px-6 rounded-full font-semibold shadow-md hover:shadow-lg transition duration-300 hover:scale-105 text-sm md:text-base ${
                  colorMap[category.color as keyof typeof colorMap] || "bg-gray-200 text-black"
                }`}
              >
                Khám Phá Ngay
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
