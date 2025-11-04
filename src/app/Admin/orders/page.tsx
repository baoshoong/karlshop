"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  userEmail: string;
  price: number | string;
  status: string;
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalRevenue, setTotalRevenue] = useState(0);

  const parsePrice = (price: number | string) => {
    if (typeof price === "number") return price;
    return Number(price.toString().replace(/\đ/g, ""));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders");
      const data: Order[] = await res.json();
      setOrders(data);

      const revenue = data
        .filter((order) => order.status.toLowerCase() === "paid")
        .reduce((sum, order) => sum + parsePrice(order.price), 0);
      setTotalRevenue(revenue);
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
      const updated = orders.filter((o) => o.id !== id);
      setOrders(updated);

      const revenue = updated
        .filter((order) => order.status.toLowerCase() === "paid")
        .reduce((sum, order) => sum + parsePrice(order.price), 0);
      setTotalRevenue(revenue);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 font-sans " >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 ">
        <h2 className="text-3xl font-bold text-red-600 tracking-wide">📦 Quản lý đơn hàng</h2>
        <div className="bg-white text-green-600 px-6 py-3 rounded-2xl shadow-lg text-xl font-bold">
          🧮 Doanh thu: {totalRevenue.toLocaleString("vi-VN")}₫
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Tìm email khách hàng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-6 py-3 border border-gray-300 rounded-2xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        />
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full text-base">
          <thead className="bg-gray-100 text-left text-base font-semibold text-gray-700">
            <tr>
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Tổng</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
              <th className="px-6 py-4 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 text-base">
                  😥 Không tìm thấy đơn hàng phù hợp.
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50 transition duration-200">
                  <td className="px-6 py-4 break-all max-w-[200px]">{order.id}</td>
                  <td className="px-6 py-4 break-all max-w-[200px]">{order.userEmail}</td>
                  <td className="px-6 py-4 font-semibold text-red-600">
                    {parsePrice(order.price).toLocaleString("vi-VN")}₫
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status.toLowerCase() === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-5">
                      <Link
                        href={`/Admin/orders/update/${order.id}`}
                        className="text-blue-600 hover:underline transition"
                      >
                        ✏️ Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:underline transition"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/Admin/orders/detail/${order.id}`}
                      className="text-green-600 hover:underline transition"
                    >
                      👁️ Xem
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                page === currentPage
                  ? "bg-red-500 text-white shadow-md scale-105"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
