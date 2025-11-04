"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const data = [
  {
    id: 1,
    title: "Bước vào phong cách với bộ sưu tập mới nhất",
    image: "/slide0.png",
  },
  {
    id: 2,
    title: "Giày chất lượng cho mọi dịp đặc biệt",
    image: "/slide6.png",
  },
  {
    id: 3,
    title: "Nâng tầm phong cách – nâng tầm cuộc sống",
    image: "/slide7.png",
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleShopNow = () => {
    router.push("/menu");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row bg-white">
      {/* Text */}
      <div className="flex-1 flex items-center justify-center flex-col gap-8 text-blue-900 font-bold px-4 md:px-10">
        <h1 className="text-4xl text-center uppercase p-4 md:p-10 md:text-6xl xl:text-7xl leading-tight drop-shadow-sm">
          {data[currentSlide].title}
        </h1>
        <button
          className="bg-orange-500 text-white py-4 px-8 rounded-full shadow-md hover:bg-orange-600 transition"
          onClick={handleShopNow}
        >
          Mua ngay
        </button>
      </div>

      {/* Image */}
      <div className="w-full flex-1 relative">
        <Image
          src={data[currentSlide].image}
          alt="Ảnh banner"
          fill
          className="object-cover transition-opacity duration-700"
        />
      </div>
    </div>
  );
};

export default Slider;