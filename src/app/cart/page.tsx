"use client";

import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CartPage = () => {
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  // Đầu component
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (products.length === 0) {
      alert("Giỏ hàng đang trống. Vui lòng thêm sản phẩm.");
      return;
    }

    if (totalPrice <= 0) {
      alert("Tổng tiền không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: totalPrice,
          products,
          status: "Not Paid!",
          userEmail: session.user.email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Thanh toán thất bại: ${errorData.message || "Lỗi không xác định"}`);
        return;
      }

      const data = await res.json();
      useCartStore.getState().clearCart();
      router.push(`/pay/${data.id}`);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col lg:flex-row bg-white text-blue-900">
      {/* SẢN PHẨM */}
      <div className="h-1/2 p-6 flex flex-col justify-start overflow-y-auto lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-16 xl:px-24 space-y-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-5 border-orange-200 gap-4 bg-orange-50 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-300 ease-in-out"
          >
            {item.img && (
              <Image
                src={item.img}
                alt={item.title}
                width={100}
                height={100}
                className="rounded-lg shadow-md"
              />
            )}
            <div className="flex-1 px-2 space-y-1">
              <h1 className="uppercase text-base sm:text-lg font-semibold text-gray-800">
                {item.title} x {item.quantity}
              </h1>
              <p className="text-sm text-gray-500 italic">{item.optionTitle}</p>
            </div>
            <h2 className="font-bold text-orange-500 text-base">{formatCurrency(item.price)}</h2>
            <button
              onClick={() => removeFromCart(item)}
              className="ml-4 text-red-500 hover:text-red-700 font-bold text-xl transition transform hover:scale-110"
            >
              ×
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center text-gray-400 text-lg font-medium py-10 italic">
            Giỏ hàng của bạn đang trống.
          </div>
        )}
      </div>

      {/* THANH TOÁN */}
      <div className="h-1/2 lg:h-full p-8 bg-orange-50 flex flex-col gap-5 justify-center lg:w-1/3 2xl:w-1/2 lg:px-16 xl:px-24 2xl:text-xl 2xl:gap-6 shadow-inner rounded-t-2xl lg:rounded-none">
        <div className="flex justify-between text-base sm:text-lg font-medium text-gray-800">
          <span>Tạm tính ({totalItems} sản phẩm)</span>
          {/* Trong phần tạm tính */}
          <span>{formatCurrency(totalPrice)}</span>

        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Phí dịch vụ</span>
          <span>0.00đ</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Phí giao hàng</span>
          <span className="text-green-600 font-semibold">Miễn phí!</span>
        </div>
        <hr className="border-orange-200" />
        <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-800">
          <span>Tổng cộng (Đã bao gồm VAT)</span>
          <span className="text-orange-600">{formatCurrency(totalPrice)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="bg-orange-500 hover:bg-orange-600 transition duration-300 ease-in-out text-white font-semibold py-3 px-8 rounded-2xl self-end mt-6 shadow-md hover:shadow-xl hover:scale-105 transform"
        >
          THANH TOÁN
        </button>
      </div>
    </div>
  );
};

export default CartPage;
