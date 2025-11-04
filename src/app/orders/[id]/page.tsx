"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";

const OrdersIDPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id || params.orderId;
  const queryClient = useQueryClient();
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      fetch(`http://localhost:3000/api/orders/${orderId}`).then((res) =>
        res.json()
      ),
    enabled: !!orderId,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success("Trạng thái đơn hàng đã được cập nhật!");
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    const statusValue = input.value.trim();

    if (!statusValue) {
      toast.error("Trạng thái không được để trống");
      return;
    }
    mutation.mutate({ id, status: statusValue });
  };

  const handlePrintInvoice = () => {
    if (!invoiceRef.current) return;

    const opt = {
      margin: 0.5,
      filename: `hoa-don-${orderId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(invoiceRef.current).save();
  };

  if (isLoading || status === "loading")
    return <p className="text-gray-500 text-center py-8">Đang tải dữ liệu...</p>;
  if (error)
    return <p className="text-red-500 text-center py-8">Đã xảy ra lỗi khi tải đơn hàng!</p>;
  if (!data)
    return <p className="text-gray-400 text-center py-8">Không tìm thấy đơn hàng.</p>;

  return (
    <div className="p-6 lg:px-32 xl:px-48 bg-gradient-to-br from-white via-orange-50 to-orange-100 min-h-screen text-[15px] leading-relaxed">
      <div ref={invoiceRef} className="bg-white rounded-2xl shadow-lg p-8 border border-orange-200">
        <button
          onClick={() => router.push("/orders")}
          className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition duration-200 shadow-sm"
        >
          ← Quay lại danh sách đơn hàng
        </button>
        <h1 className="text-3xl font-extrabold mb-8 border-b pb-4 text-orange-700">
          Chi tiết đơn hàng — <span className="text-orange-500">{orderId}</span>
        </h1>

        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <p className="text-gray-700">
            <span className="font-semibold">Ngày đặt:</span> {new Date(data.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Tổng tiền:</span>{" "}
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(data.price)}
          </p>
        </div>

        {data.address && (
          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl max-w-md shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">Địa chỉ giao hàng:</h3>
            <div className="text-gray-700 space-y-1">
              {data.address.name && <p><strong>Họ tên:</strong> {data.address.name}</p>}
              {data.address.phone && <p><strong>Số điện thoại:</strong> {data.address.phone}</p>}
              {data.address.email && <p><strong>Email:</strong> {data.address.email}</p>}
              {data.address.line1 && <p><strong>Địa chỉ 1:</strong> {data.address.line1}</p>}
              {data.address.line2 && <p><strong>Địa chỉ 2:</strong> {data.address.line2}</p>}
              {data.address.street && <p><strong>Đường:</strong> {data.address.street}</p>}
              {data.address.city && <p><strong>Thành phố:</strong> {data.address.city}</p>}
              {data.address.state && <p><strong>Tỉnh/Bang:</strong> {data.address.state}</p>}
              {(data.address.postalCode || data.address.postal_code) && (
                <p><strong>Mã bưu điện:</strong> {data.address.postalCode || data.address.postal_code}</p>
              )}
              {data.address.country && <p><strong>Quốc gia:</strong> {data.address.country}</p>}
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-5 text-orange-600">Danh sách sản phẩm:</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md rounded-xl overflow-hidden text-sm bg-white">
            <thead className="bg-orange-200 text-orange-900">
              <tr>
                <th className="p-3 text-left">Sản phẩm</th>
                <th className="p-3 text-left">Kích cỡ</th>
                <th className="p-3 text-left hidden sm:table-cell">Hình ảnh</th>
                <th className="p-3 text-left">Số lượng</th>
                <th className="p-3 text-left">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product: any) => (
                <tr key={product.id} className="border-t hover:bg-orange-50 transition-all duration-200">
                  <td className="p-3 font-medium text-gray-800">{product.title}</td>
                  <td className="p-3">
                    {product.optionTitle ? (
                      <span className="text-sm text-gray-700">{product.optionTitle}</span>
                    ) : product.options ? (
                      Array.isArray(product.options) ? (
                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                          {product.options.map((opt: any, idx: number) => (
                            <li key={idx}>{opt.title} × {opt.quantity}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-gray-700">{product.options.title} × {product.options.quantity}</div>
                      )
                    ) : (
                      <span className="italic text-gray-400">Không có phân loại</span>
                    )}
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    {product.img ? (
                      <Image
                        src={product.img}
                        alt={product.title}
                        width={50}
                        height={50}
                        className="object-cover rounded-md"
                        unoptimized
                      />
                    ) : (
                      <span className="text-gray-400 italic">Không có ảnh</span>
                    )}
                  </td>
                  <td className="p-3 text-center">{product.quantity || 1}</td>
                  <td className="p-3 font-semibold text-orange-600">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {session?.user.isAdmin ? (
        <form
          onSubmit={(e) => handleUpdate(e, data.id)}
          className="mt-10 mb-8 flex items-center gap-4 max-w-sm"
        >
          <input
            defaultValue={data.status}
            className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
            disabled={mutation.status === "pending"}
          >
            {mutation.status === "pending" ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </form>
      ) : (
        <p className="mt-6 text-base">
          <span className="font-semibold">Trạng thái:</span>{" "}
          <span
            className={`px-3 py-1 rounded-full text-white font-semibold ${data.status === "delivered"
              ? "bg-green-500"
              : data.status === "pending"
                ? "bg-yellow-400"
                : "bg-orange-500"
              }`}
          >
            {data.status === "delivered"
              ? "Đã giao"
              : data.status === "pending"
                ? "Chờ xử lý"
                : data.status}
          </span>
        </p>
      )}

      {session?.user && (
        <button
          onClick={handlePrintInvoice}
          className="mt-10 bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg shadow-md transition duration-200"
        >
          In hóa đơn
        </button>
      )}
    </div>
  );
};

export default OrdersIDPage;
