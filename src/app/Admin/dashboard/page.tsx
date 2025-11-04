"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type RevenueData = {
  period: string;
  revenue: number;
};

type ApiResponse = {
  revenueData: RevenueData[];
  totalRevenue: number;
};

const FilterButton = ({
  isActive,
  children,
  onClick,
}: {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 text-sm md:text-base tracking-wide ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg"
        : "bg-gray-100 text-gray-700 hover:bg-blue-100"
    }`}
  >
    {children}
  </button>
);

export default function DashboardPage() {
  const [filter, setFilter] = useState<"week" | "month" | "year">("week");
  const [data, setData] = useState<RevenueData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRevenue() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/revenue?filter=${filter}`);
        if (!res.ok) throw new Error(`Lỗi: ${res.statusText}`);
        const json: ApiResponse = await res.json();
        setData(json.revenueData);
        setTotalRevenue(json.totalRevenue);
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu");
        setData([]);
        setTotalRevenue(0);
      } finally {
        setLoading(false);
      }
    }

    fetchRevenue();
  }, [filter]);

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Báo cáo doanh thu", 14, 20);
    doc.setFontSize(12);
    doc.text(`Thu thong ke: ${filter.toUpperCase()}`, 14, 30);
    doc.text(
      `Tong doanh thu: ${totalRevenue.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })}`,
      14,
      38
    );

    autoTable(doc, {
      startY: 45,
      head: [["STT", "Thoi gian", "Doanh thu"]],
      body: data.map((item, index) => [
        index + 1,
        item.period,
        item.revenue.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
      ]),
      theme: "striped",
      headStyles: { fillColor: [49, 130, 206] },
    });

    doc.save(`bao-cao-doanh-thu-${filter}.pdf`);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl transition-all duration-300">
      <h2 className="text-4xl font-extrabold mb-8 text-blue-800 flex items-center gap-2">
        📊 Thống kê doanh thu
      </h2>

      <div className="mb-6">
        <p className="mb-3 text-lg font-medium text-gray-700">📅 Chọn khoảng thời gian:</p>
        <div className="flex flex-wrap gap-3">
          <FilterButton isActive={filter === "week"} onClick={() => setFilter("week")}>
            🗓️ Tuần này
          </FilterButton>
          <FilterButton isActive={filter === "month"} onClick={() => setFilter("month")}>
            📆 Tháng này
          </FilterButton>
          <FilterButton isActive={filter === "year"} onClick={() => setFilter("year")}>
            📈 Năm nay
          </FilterButton>
        </div>
      </div>

      <div className="mb-6 text-2xl font-semibold text-gray-800">
        Tổng doanh thu:{" "}
        <span className="text-green-600 font-extrabold">
          {totalRevenue > 0
            ? totalRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            : "0 ₫"}
        </span>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">⏳ Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-center text-red-500 font-medium">❌ {error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500 italic">😕 Không có dữ liệu để hiển thị.</p>
      ) : (
        <>
          <div className="w-full h-[340px] mb-8">
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis
                  dataKey="period"
                  tick={{ fill: "#4a5568", fontWeight: 600, fontSize: 12 }}
                  axisLine={{ stroke: "#cbd5e0" }}
                />
                <YAxis
                  tick={{ fill: "#4a5568", fontWeight: 600, fontSize: 12 }}
                  axisLine={{ stroke: "#cbd5e0" }}
                  tickFormatter={(value) => value.toLocaleString("vi-VN") + " ₫"}
                />
                <Tooltip
                  formatter={(value: number) => value.toLocaleString("vi-VN") + " ₫"}
                  contentStyle={{
                    borderRadius: "10px",
                    borderColor: "#63b3ed",
                    fontWeight: "bold",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{
                    fontWeight: "bold",
                    color: "#2b6cb0",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="📉 Doanh thu"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  activeDot={{ r: 8, stroke: "#2563eb", strokeWidth: 3 }}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6">
            <button
              onClick={exportToPDF}
              className="mb-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full text-sm hover:from-green-600 hover:to-green-700 transition duration-300 shadow-lg"
            >
              📄 Tải về dưới dạng PDF
            </button>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md bg-white mt-4">
              <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-blue-100 text-blue-800 text-sm font-bold uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 border-b border-blue-200">STT</th>
                    <th className="px-4 py-3 border-b border-blue-200">🗓️ Thời gian</th>
                    <th className="px-4 py-3 border-b border-blue-200">💰 Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={item.period}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 border-b border-gray-100 text-center">{index + 1}</td>
                      <td className="px-4 py-3 border-b border-gray-100">{item.period}</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-green-700 font-medium">
                        {item.revenue.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
