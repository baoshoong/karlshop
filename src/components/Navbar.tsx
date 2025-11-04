import React from "react";
import Menu from "./Menu";
import Link from "next/link";
import CartIcon from "./CartIcon";
import UserLinks from "./UserLinks";

const Navbar = () => {
  return (
    <div className="h-12 text-blue-900 p-4 flex items-center justify-between border-b-2 border-b-orange-500 uppercase md:h-24 lg:px-20 xl:px-40 bg-white shadow-sm">
      {/* Liên kết bên trái */}
      <div className="hidden md:flex gap-6 flex-1 text-sm md:text-base tracking-wide hover:[&>a:hover]:underline">
        <Link href="/">Trang chủ</Link>
        <Link href="/menu">Danh mục</Link>
        <Link href="/contact">Liên hệ</Link>
      </div>

      {/* Logo */}
      <div className="text-xl md:font-bold flex-1 text-center md:text-center tracking-widest">
        <Link href="/">KARL Shop</Link>
      </div>

      {/* Menu mobile */}
      <div className="md:hidden">
        <Menu />
      </div>

      {/* Liên kết bên phải */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        <UserLinks />
        <CartIcon />
      </div>
    </div>
  );
};

export default Navbar;