"use client";

import CheckoutForm from "../../../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaCheckCircle, FaTruck, FaSpinner } from "react-icons/fa";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Product = {
  id: string;
  title: string;
  img?: string;
  price: number;
  quantity: number;
};

type OrderDetail = {
  id: string;
  createdAt: string;
  price: number;
  status: string;
  products: Product[];
};

const PayPage = ({ params }: { params: { id: string } }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const { id } = params;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  useEffect(() => {
    const fetchIntent = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/create-intent/${id}`, {
          method: "POST",
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Lỗi lấy thông tin thanh toán:", err);
      }
    };

    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/orders/${id}`);
        const data = await res.json();
        setOrderDetail(data);
      } catch (err) {
        console.error("Lỗi lấy thông tin đơn hàng:", err);
      }
    };

    fetchIntent();
    fetchOrderDetail();
  }, [id]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  const renderStatus = (status: string) => {
    if (status === "delivered") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700 shadow-sm">
          <FaCheckCircle className="text-green-600" /> Đã giao
        </span>
      );
    } else if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700 shadow-sm animate-pulse">
          <FaSpinner className="animate-spin" /> Đang xử lý
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-700 shadow-sm">
          <FaTruck className="text-orange-500" /> Đang giao
        </span>
      );
    }
  };

  return (
    <div className="px-4 py-8 bg-white min-h-screen">
      {orderDetail && (
        <div className="bg-orange-50 border border-orange-200 rounded-3xl p-8 mx-auto max-w-5xl shadow-xl transition-shadow duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-orange-600">🧾 Chi tiết đơn hàng</h2>

          <div className="grid gap-2 text-[15px] text-gray-800">
            <p><span className="font-semibold">Mã đơn:</span> {orderDetail.id}</p>
            <p><span className="font-semibold">Ngày đặt:</span> {new Date(orderDetail.createdAt).toLocaleString()}</p>
            <p><span className="font-semibold">Trạng thái:</span> {renderStatus(orderDetail.status)}</p>
            <p>
              <span className="font-semibold">Tổng tiền:</span>{" "}
              <span className="text-green-700 font-bold text-lg">
                {formatCurrency(orderDetail.price)}
              </span>
            </p>
          </div>

          <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-900">🛒 Danh sách sản phẩm:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm rounded-lg overflow-hidden shadow-md">
              <thead className="bg-orange-100 text-orange-800 font-medium">
                <tr>
                  <th className="px-4 py-2 text-left">Sản phẩm</th>
                  <th className="px-4 py-2 text-left">Tuỳ chọn</th>
                  <th className="px-4 py-2 text-left">Số lượng</th>
                  <th className="px-4 py-2 text-left hidden sm:table-cell">Hình ảnh</th>
                  <th className="px-4 py-2 text-left">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700">
                {orderDetail.products.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-orange-50 transition-all duration-150">
                    <td className="px-4 py-3 font-medium">{product.title}</td>
                    <td className="px-4 py-3">
                      {"optionTitle" in product ? (
                        <span>{(product as any).optionTitle}</span>
                      ) : "options" in product ? (
                        Array.isArray((product as any).options) ? (
                          <ul className="list-disc list-inside space-y-1">
                            {(product as any).options.map((opt: any, idx: number) => (
                              <li key={idx}>{opt.title} × {opt.quantity}</li>
                            ))}
                          </ul>
                        ) : (
                          <span>{(product as any).options.title} × {(product as any).options.quantity}</span>
                        )
                      ) : (
                        <span className="italic text-gray-400">Không có tuỳ chọn</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{product.quantity}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {product.img ? (
                        <Image
                          src={product.img}
                          alt={product.title}
                          width={60}
                          height={60}
                          className="object-cover rounded-xl border"
                          unoptimized
                        />
                      ) : (
                        <span className="text-gray-400 italic">Không có ảnh</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(product.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {clientSecret && (
        <div className="mt-8 max-w-3xl mx-auto">
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm orderId={id} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default PayPage;
