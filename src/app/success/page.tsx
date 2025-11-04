"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get("payment_intent");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        if (payment_intent) {
          await fetch(`http://localhost:3000/api/confirm/${payment_intent}`, {
            method: "PUT",
          });
        }

        setTimeout(() => {
          if (orderId) {
            router.push(`/orders/${orderId}/invoice`);
          } else {
            router.push("/orders");
          }
        }, 1000);
      } catch (err) {
        console.error("Lỗi xác nhận thanh toán:", err);
      }
    };

    if (payment_intent || orderId) {
      makeRequest();
    }
  }, [payment_intent, orderId, router]);

  return (
    <div className="min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex items-center justify-center text-center text-2xl text-green-700 relative">
      <p className="max-w-[600px] leading-relaxed">
        ✅ Thanh toán thành công!<br />
        Đang chuyển hướng đến đơn hàng của bạn...<br />
        Vui lòng không đóng cửa sổ này.
      </p>
    </div>
  );
};

export default SuccessPage;
