
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="h-12 md:h-24 p-4 lg:px-20 xl:px-40 text-blue-900 flex items-center justify-between border-t border-orange-300 bg-white">
      <Link href="/" className="font-bold text-xl tracking-wide text-orange-600 hover:text-orange-700 transition">
        KARL
      </Link>
      <p className="text-sm md:text-base text-blue-800">
        © 2025 KARL. Thời trang & giày dép cao cấp. Đã đăng ký bản quyền.
      </p>
    </div>
  );
};

export default Footer;