"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LoginPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]); // ✅ Chạy sau khi render

  if (status === "loading") {
    return <p className="text-center mt-10 text-gray-600 text-base">Đang tải...</p>;
  }

  return (
    <div className="p-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
      {/* HỘP CHỨA */}
      <div className="h-full rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.12)] flex flex-col md:flex-row md:h-[72%] md:w-full lg:w-[60%] 2xl:w-1/2 overflow-hidden transition-all duration-300 border border-blue-100">
        {/* ẢNH BÊN TRÁI */}
        <div className="relative h-1/3 w-full md:h-full md:w-1/2">
          <Image
            src="/loginBg1.png"
            alt="Hình nền đăng nhập"
            fill
            priority
            className="object-cover transition-transform duration-500 scale-100 hover:scale-105"
          />
        </div>

        {/* KHỐI FORM */}
        <div className="p-8 md:p-12 flex flex-col justify-center gap-6 md:gap-8 md:w-1/2 bg-white">
          <h1 className="font-bold text-2xl md:text-3xl text-gray-800 leading-snug tracking-tight flex items-center gap-2">
            <span>👋</span> <span>Chào mừng bạn trở lại</span>
          </h1>
          <p className="text-gray-600 text-base leading-relaxed tracking-wide">
            Đăng nhập vào tài khoản hoặc tạo tài khoản mới bằng Google.
          </p>

          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-3 py-3 px-6 bg-white text-gray-800 border border-orange-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.025] active:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <Image
              src="/google.png"
              alt="Google"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-sm md:text-base font-medium">Đăng nhập bằng Google</span>
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Gặp sự cố?{" "}
            <Link href="/" className="underline hover:text-blue-600 transition-colors">
              Liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
