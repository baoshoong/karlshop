"use client";

import { OrderType } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from "react";
import { toast } from "react-toastify";
import Link from "next/link";

const OrdersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch("http://localhost:3000/api/orders").then((res) => res.json()),
  });
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    const status = input.value;

    mutation.mutate({ id, status });
    toast.success("Trạng thái đơn hàng đã được cập nhật!");
  };

  if (isLoading || status === "loading") return "Đang tải dữ liệu...";

  return (
    <div className="p-4 lg:px-20 xl:px-40 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 text-center">Quản lý đơn hàng</h1>
      <div className="overflow-x-auto shadow-md rounded-2xl bg-white p-4">
        <table className="w-full border-separate border-spacing-y-4 text-blue-800 text-sm sm:text-base">
          <tbody>
            {data.map((item: OrderType) => (
              <tr
                key={item.id}
                className={`
                  ${item.status !== "delivered"
                    ? "bg-orange-100 hover:bg-orange-200"
                    : "bg-gray-100 hover:bg-red-50"
                  }
                  transition-all duration-300 rounded-xl shadow-sm hover:shadow-lg text-sm sm:text-base
                `}
              >
                <td className="hidden md:table-cell py-4 px-4 font-mono text-xs text-gray-600">
                  #{item.id.slice(0, 6)}...
                </td>
                <td className="py-4 px-4 font-medium text-gray-800 text-center">
                  {item.createdAt.toString().slice(0, 10)}
                </td>
                <td className="py-4 px-4 font-semibold text-orange-700 text-center whitespace-nowrap">
                  {formatCurrency(item.price)}
                </td>
                <td className="hidden md:table-cell py-4 px-4 font-medium text-gray-700 truncate max-w-[150px]">
                  {item.products?.[0]?.title || "Không có sản phẩm"}
                </td>

                {session?.user.isAdmin ? (
                  <td className="py-4 px-4">
                    <form
                      className="flex items-center justify-center gap-2"
                      onSubmit={(e) => handleUpdate(e, item.id)}
                    >
                      <input
                        placeholder={item.status}
                        className="p-2 text-sm border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full transition-all shadow-sm hover:shadow-md"
                        aria-label="Sửa trạng thái"
                      >
                        <Image src="/edit.png" alt="Chỉnh sửa" width={20} height={20} />
                      </button>
                    </form>
                  </td>
                ) : (
                  <td className="py-4 px-4 font-semibold text-center text-orange-700">
                    {item.status}
                  </td>
                )}

                <td className="py-4 px-4 text-center">
                  <Link
                    href={`/orders/${item.id}`}
                    className="text-blue-600 underline hover:text-blue-800 transition-all"
                  >
                    Chi tiết
                  </Link>
                </td>

                <td className="py-4 px-4 text-center">
                  {item.status === "paid" && (
                    <button
                      onClick={async () => {
                        if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
                        try {
                          await fetch(`http://localhost:3000/api/orders/${item.id}`, {
                            method: "DELETE",
                          });
                          toast.success("Đã xóa đơn hàng thành công!");
                          queryClient.invalidateQueries({ queryKey: ["orders"] });
                        } catch (error) {
                          toast.error("Xóa đơn hàng thất bại.");
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-shadow shadow-sm hover:shadow-lg"
                      aria-label="Xóa đơn hàng"
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
