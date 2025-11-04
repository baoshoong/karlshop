"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartIcon from "./CartIcon";

const links = [
  { id: 1, title: "Trang Chủ", url: "/" },
  { id: 2, title: "Danh Mục", url: "/menu" },
  // { id: 3, title: "Working Hours", url: "/" },
  { id: 4, title: "Liên Hệ", url: "/contact" },
];

const Menu = () => {
  const [open, setOpen] = useState(false);

  // TEMPORARY
  const user = false;

  return (
    <div>
      <Image
        src={open ? "/close.png" : "/open.png"}
        alt=""
        width={24}
        height={24}
        onClick={() => setOpen(!open)}
        className="cursor-pointer transition-transform duration-200"
      />
      {open && (
        <div className="bg-orange-300 text-blue-900 absolute left-0 top-24 w-full h-[calc(100vh-6rem)] flex flex-col gap-8 items-center justify-center text-3xl z-10 transition-all">
          {links.map((item) => (
            <Link
              href={item.url}
              key={item.id}
              onClick={() => setOpen(false)}
              className="hover:text-orange-600 transition"
            >
              {item.title}
            </Link>
          ))}

          <Link
            href={user ? "/orders" : "/login"}
            onClick={() => setOpen(false)}
            className="hover:text-orange-600 transition"
          >
            {user ? "Orders" : "Đăng Nhập"}
            
          </Link>

          <Link href="/cart" onClick={() => setOpen(false)}>
            <CartIcon />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
