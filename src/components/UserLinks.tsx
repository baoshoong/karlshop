"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export const UserLinks = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <div className="relative group">
      {status === "authenticated" ? (
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <Image
            src={session.user?.image || "/default-avatar.png"}
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full border-2 border-blue-500"
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-10 w-40 bg-white shadow-md rounded-md z-50 hidden group-hover:block">
            <div className="p-2 border-b text-sm text-gray-700">
              👋 {session.user?.name || "User"}
            </div>

            {/* Link đến trang profile */}
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Trang cá nhân
            </Link>

            <Link
              href={session.user?.isAdmin ? "/Admin" : "/orders"}
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              {session.user?.isAdmin ? "Trang Admin" : "Đơn hàng"}
            </Link>

            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      ) : (
        <Link
          href="/login"
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Đăng nhập
        </Link>
      )}
    </div>
  );
};

export default UserLinks;
