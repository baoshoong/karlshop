import Image from "next/image";
import React from "react";
import CountDown from "./CountDown";

const Offer = () => {
  return (
    <div className="bg-white h-screen flex flex-col md:flex-row md:justify-between md:bg-[url('/bg1.jpg')] bg-cover bg-center md:h-[70vh]">
      <div className="flex-1 flex flex-col justify-center items-center text-center gap-8 p-6 bg-white/90 md:bg-transparent backdrop-blur-sm rounded-lg">
        <h1 className="text-white text-4xl md:text-5xl xl:text-6xl font-bold leading-tight drop-shadow-lg">
          Bộ sưu tập độc quyền & Phụ kiện thời trang
        </h1>
        <p className="text-white xl:text-xl drop-shadow-md">
          Khám phá các thiết kế giới hạn giúp bạn nâng tầm phong cách mỗi ngày.
        </p>
        <CountDown />
        <button className="bg-orange-500 text-white rounded-full py-3 px-6 hover:bg-orange-600 transition shadow-md">
          Mua ngay
        </button>
      </div>

      <div className="flex-1 w-full relative md:h-full">
        <Image
          src="/image.png"
          alt="Ưu đãi thời trang"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Offer;