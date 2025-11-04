"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type CartItemType = {
  id: string;
  title: string;
  img?: string;
  price: number;
  optionTitle?: string;
  quantity: number;
};

type AddressType = {
  name?: string;
  phone?: string;
  email?: string;
  line1?: string;
  line2?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  postal_code?: string;
  country?: string;
};

type Order = {
  id: string;
  userEmail: string;
  price: number;
  products: CartItemType[];
  status: string;
  createdAt: string;
  address?: AddressType;
};
const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);


const OrderDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy đơn hàng");
        const data = await res.json();
        setOrder(data);
      } catch {
        router.push("/Admin/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) return <div className="p-8 text-lg font-medium text-gray-600">🔄 Đang tải dữ liệu...</div>;

  if (!order)
    return (
      <div className="p-8 text-lg text-gray-700">
        <p>🚫 Không tìm thấy đơn hàng.</p>
        <Link
          href="/Admin/orders"
          className="mt-3 inline-block text-red-600 hover:underline hover:text-red-800 transition"
        >
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>
    );

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100">
      <Link
        href="/Admin/orders"
        className="inline-flex items-center text-red-600 hover:text-red-800 font-semibold text-base mb-6 transition duration-300"
      >
        ← Quay lại danh sách đơn hàng
      </Link>

      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4 border-gray-200">
        🧾 Chi tiết đơn hàng
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-700 mb-8">
        <p><strong>Mã đơn hàng:</strong> {order.id}</p>
        <p><strong>Email khách hàng:</strong> {order.userEmail}</p>
        <p><strong>Thời gian tạo:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p className="capitalize">
          <strong>Trạng thái:</strong>{" "}
          <span
            className={`ml-2 px-3 py-1 rounded-full text-sm font-medium shadow transition ${order.status.toLowerCase() === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {order.status}
          </span>
        </p>
      </div>

      {order.address && (
        <div className="mb-10 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">📦 Địa chỉ giao hàng:</h3>
          <div className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {order.address.name && <p><strong>Họ tên:</strong> {order.address.name}</p>}
            {order.address.phone && <p><strong>Số điện thoại:</strong> {order.address.phone}</p>}
            {order.address.email && <p><strong>Email:</strong> {order.address.email}</p>}
            {order.address.line1 && <p><strong>Địa chỉ 1:</strong> {order.address.line1}</p>}
            {order.address.line2 && <p><strong>Địa chỉ 2:</strong> {order.address.line2}</p>}
            {order.address.street && <p><strong>Đường:</strong> {order.address.street}</p>}
            {order.address.city && <p><strong>Thành phố:</strong> {order.address.city}</p>}
            {order.address.state && <p><strong>Tỉnh / Bang:</strong> {order.address.state}</p>}
            {(order.address.postalCode || order.address.postal_code) && (
              <p><strong>Mã bưu điện:</strong> {order.address.postalCode || order.address.postal_code}</p>
            )}
            {order.address.country && <p><strong>Quốc gia:</strong> {order.address.country}</p>}
          </div>
        </div>
      )}

      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">🛍️ Danh sách sản phẩm</h3>
        {order.products.length === 0 ? (
          <p className="text-gray-500 italic">Không có sản phẩm trong đơn hàng này.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full text-sm text-gray-800 bg-white">
              <thead className="bg-red-100 text-red-700 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Sản phẩm</th>
                  <th className="px-5 py-3 text-left">Kích cỡ</th>
                  <th className="px-5 py-3 text-left">Số lượng</th>
                  <th className="px-5 py-3 text-left">Giá</th>
                  <th className="px-5 py-3 text-left">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-red-50 transition-all duration-200"
                  >
                    <td className="px-5 py-3 flex items-center gap-4">
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded-lg border shadow-sm"
                        />
                      )}
                      <span className="font-medium">{item.title}</span>
                    </td>
                    <td className="px-5 py-3">{item.optionTitle || "-"}</td>
                    <td className="px-5 py-3">{item.quantity}</td>
                    <td className="px-5 py-3">{formatVND(item.price)}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      {formatVND(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-xl font-bold text-right text-green-700">
        🧮 Tổng tiền: {formatVND(order.price)}
      </div>

    </div>
  );
};

export default OrderDetailPage;
