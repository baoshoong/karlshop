"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  status: string;
  products: CartItemType[];
  address?: AddressType;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);

const UpdateOrderPage = () => {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu đơn hàng");

        const text = await res.text();
        if (!text) throw new Error("Dữ liệu trả về rỗng");

        const data = JSON.parse(text);
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (authStatus === "loading") return <div>Đang tải...</div>;

  if (authStatus === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert("Cập nhật đơn hàng thành công!");
        router.push(`/Admin/orders`);
      } else {
        console.error("Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:px-20 xl:px-40 min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-white text-red-600">
      <form
        className="shadow-2xl flex flex-col gap-6 p-8 w-full max-w-3xl bg-white rounded-3xl overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <Link
          href="/Admin/orders"
          className="inline-flex items-center text-red-600 hover:text-red-800 hover:underline font-semibold transition-all duration-200"
        >
          ← Quay lại danh sách đơn hàng
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Cập nhật đơn hàng</h1>

        {loading ? (
          <p className="text-gray-600">Đang tải dữ liệu đơn hàng...</p>
        ) : order === null ? (
          <p className="text-red-500">Không tìm thấy đơn hàng.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Mã đơn hàng</label>
                <input
                  type="text"
                  value={order.id}
                  disabled
                  className="p-3 border rounded-lg bg-gray-100 w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email khách hàng</label>
                <input
                  type="text"
                  value={order.userEmail}
                  disabled
                  className="p-3 border rounded-lg bg-gray-100 w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tổng tiền</label>
                <input
                  type="text"
                  value={formatCurrency(order.price)}
                  disabled
                  className="p-3 border rounded-lg bg-gray-100 w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                  className="p-3 border rounded-lg bg-white w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="not paid">Chưa thanh toán</option>
                </select>
              </div>
            </div>

            {order.address && (
              <div className="bg-gray-100 p-4 rounded-xl mt-4 text-sm text-gray-700 shadow-inner">
                <h3 className="font-semibold text-base mb-2">Thông tin giao hàng</h3>
                {order.address.name && <p><strong>Họ tên:</strong> {order.address.name}</p>}
                {order.address.phone && <p><strong>SĐT:</strong> {order.address.phone}</p>}
                {order.address.email && <p><strong>Email:</strong> {order.address.email}</p>}
                {order.address.line1 && <p><strong>Địa chỉ 1:</strong> {order.address.line1}</p>}
                {order.address.line2 && <p><strong>Địa chỉ 2:</strong> {order.address.line2}</p>}
                {order.address.street && <p><strong>Đường:</strong> {order.address.street}</p>}
                {order.address.city && <p><strong>Thành phố:</strong> {order.address.city}</p>}
                {order.address.state && <p><strong>Tỉnh/Bang:</strong> {order.address.state}</p>}
                {(order.address.postalCode || order.address.postal_code) && (
                  <p><strong>Mã bưu điện:</strong> {order.address.postalCode || order.address.postal_code}</p>
                )}
                {order.address.country && <p><strong>Quốc gia:</strong> {order.address.country}</p>}
              </div>
            )}

            <div className="overflow-x-auto mt-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Sản phẩm</h3>
              <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden shadow-sm text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border">Sản phẩm</th>
                    <th className="px-4 py-2 border">Phân loại</th>
                    <th className="px-4 py-2 border">Số lượng</th>
                    <th className="px-4 py-2 border">Giá</th>
                    <th className="px-4 py-2 border">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="border px-4 py-3 flex items-center gap-3">
                        {item.img && (
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded-md"
                          />
                        )}
                        <span>{item.title}</span>
                      </td>
                      <td className="border px-4 py-3 text-center">{item.optionTitle || "-"}</td>
                      <td className="border px-4 py-3 text-center">{item.quantity}</td>
                      <td className="border px-4 py-3 text-center">{formatCurrency(item.price)}</td>
                      <td className="border px-4 py-3 text-center font-semibold text-green-600">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-bold rounded-xl transition duration-300"
            >
              Cập nhật đơn hàng
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default UpdateOrderPage;
