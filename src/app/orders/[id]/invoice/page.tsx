"use client";

import { OrderType } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useRef } from "react";
import { useReactToPrint } from 'react-to-print';

const InvoicePage = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params.id;
  const componentRef = useRef<HTMLDivElement>(null);

  const { isLoading, error, data: order } = useQuery<OrderType>({
    queryKey: ["order", id],
    queryFn: () =>
      fetch(`http://localhost:3000/api/orders/${id}`).then((res) => res.json()),
  });

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice-${order?.id}`,
  });

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-blue-700 animate-pulse">Đang tải hóa đơn...</div>
      </div>
    );

  if (error || !order)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Không tìm thấy hóa đơn</div>
      </div>
    );

  const subtotal = order.products?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\:hidden { display: none !important; }
          .print-header { background: #1e40af !important; color: white !important; }
          table, th, td { border-collapse: collapse !important; }
          th, td { border: 1px solid #000 !important; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0 font-sans">
        <div className="max-w-5xl mx-auto px-4 print:px-0 print:max-w-none">
          <div className="mb-6 flex justify-end print:hidden">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              In Hóa Đơn
            </button>
          </div>

          <div ref={componentRef} className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
            <div className="print-header bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-extrabold mb-2 tracking-tight">KARL Fashion</h1>
                  <p className="text-blue-100 text-sm">Phong cách của bạn, đam mê của chúng tôi!</p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold mb-2">HÓA ĐƠN</h2>
                  <p className="text-blue-100">#{order?.id?.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>

            <div className="p-8 print:p-6 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Từ:</h3>
                  <div className="text-gray-600 text-sm space-y-1">
                    <p className="font-semibold text-base">KARL Fashion</p>
                    <p>123 Fashion Avenue</p>
                    <p>Style City, SC 12345</p>
                    <p>Điện thoại: 1-800-FASHION</p>
                    <p>Email: info@karlfashion.com</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Người mua:</h3>
                  <div className="text-gray-600 text-sm">
                    <p className="font-semibold text-base">{order.userEmail || 'Khách vãng lai'}</p>
                    <p>Mã khách: {order.userEmail?.split('@')[0] || 'GUEST'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Giao đến:</h3>
                  <div className="text-gray-600 text-sm space-y-1">
                    {order.address ? (
                      <>
                        <p>{order.address.line1}</p>
                        {order.address.line2 && <p>{order.address.line2}</p>}
                        <p>{order.address.city}, {order.address.state}</p>
                        <p>{order.address.country} - {order.address.postal_code}</p>
                      </>
                    ) : (
                      <p className="text-gray-500">Không có thông tin giao hàng</p>
                    )}
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
                <div>
                  <p className="text-sm text-gray-600">Ngày xuất:</p>
                  <p className="font-semibold text-base">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái đơn:</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${order.status === 'delivered'
                      ? 'bg-green-100 text-green-800 border-green-400'
                      : order.status === 'preparing'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-400'
                        : 'bg-orange-100 text-orange-800 border-orange-400'
                    }`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phương thức thanh toán:</p>
                  <p className="font-semibold text-base">Online Payment</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Sản phẩm đã đặt:</h3>
                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full text-sm border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800">
                        <th className="px-4 py-2 border border-gray-300 text-left">Sản phẩm</th>
                        <th className="px-4 py-2 border border-gray-300 text-center">Số lượng</th>
                        <th className="px-4 py-2 border border-gray-300 text-right">Đơn giá</th>
                        <th className="px-4 py-2 border border-gray-300 text-right">Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products?.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border border-gray-200">
                            <div className="font-medium text-gray-800">{item.title || 'Sản phẩm'}</div>
                            {item.optionTitle && (
                              <div className="text-gray-500 text-xs">Phân loại: {item.optionTitle}</div>
                            )}
                          </td>
                          <td className="text-center px-4 py-3 border border-gray-200">{item.quantity}</td>
                          <td className="text-right px-4 py-3 border border-gray-200">{formatCurrency(item.price)}</td>
                          <td className="text-right px-4 py-3 border border-gray-200 font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thuế (10%):</span>
                    <span className="font-semibold">{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-600 pt-8 border-t text-sm">
                <p className="mb-2">Cảm ơn bạn đã mua sắm tại KARL Fashion!</p>
                <p>Mọi thắc mắc về hóa đơn, vui lòng liên hệ info@karlfashion.com</p>
                <p className="text-xs text-gray-400 mt-2">Hóa đơn được tạo lúc {new Date().toLocaleString("vi-VN")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;
