import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
  isSameDay,
} from "date-fns";

type RevenueData = {
  period: string;
  revenue: number;
};

type ApiResponse = {
  revenueData: RevenueData[];
  totalRevenue: number;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "week";
  const now = new Date();

  let startDate: Date;
  let endDate: Date;

  // Xác định khoảng thời gian dựa theo filter
  switch (filter) {
    case "month":
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case "year":
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      break;
    case "week":
    default:
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
      break;
  }

  // Lấy các đơn hàng đã thanh toán trong khoảng thời gian, sắp xếp theo ngày tăng dần
  const paidOrders = await prisma.order.findMany({
    where: {
      status: "paid",
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      price: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Tính tổng doanh thu
  const totalRevenue = paidOrders.reduce(
    (sum, o) => sum + Number(o.price),
    0
  );

  let revenueData: RevenueData[] = [];

  if (filter === "week") {
    // Mảng 7 ngày trong tuần bắt đầu từ startDate
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date;
    });

    revenueData = days.map((day) => {
      const total = paidOrders
        .filter((o) => isSameDay(new Date(o.createdAt), day))
        .reduce((sum, o) => sum + Number(o.price), 0);

      return {
        period: format(day, "EEE"), // Ví dụ: Mon, Tue
        revenue: total,
      };
    });
  } else if (filter === "month") {
    // Chia tháng thành 4 tuần: 1-7, 8-14, 15-21, 22-end tháng
    const weeks = [1, 2, 3, 4];

    revenueData = weeks.map((week) => {
      const total = paidOrders
        .filter((o) => {
          const date = new Date(o.createdAt).getDate();
          return (
            (week === 1 && date <= 7) ||
            (week === 2 && date > 7 && date <= 14) ||
            (week === 3 && date > 14 && date <= 21) ||
            (week === 4 && date > 21)
          );
        })
        .reduce((sum, o) => sum + Number(o.price), 0);

      return { period: `Week ${week}`, revenue: total };
    });
  } else if (filter === "year") {
    revenueData = Array.from({ length: 12 }, (_, i) => {
      const total = paidOrders
        .filter((o) => new Date(o.createdAt).getMonth() === i)
        .reduce((sum, o) => sum + Number(o.price), 0);

      const label = format(new Date(now.getFullYear(), i, 1), "MMM"); // Jan, Feb, ...
      return { period: label, revenue: total };
    });
  }

  return NextResponse.json({ revenueData, totalRevenue });
}
