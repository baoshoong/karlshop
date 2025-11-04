"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  useEffect,
  useState,
  isValidElement,
  cloneElement,
  ReactNode,
  ReactElement,
} from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    categories: 0,
    users: 0,
  });

  const fetchCounts = async () => {
    try {
      const [productsRes, ordersRes, categoriesRes, usersRes] = await Promise.all([
        fetch("/api/products?all=true"),
        fetch("/api/orders"),
        fetch("/api/categories"),
        fetch("/api/admin/users"),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const categoriesData = await categoriesRes.json();
      const usersData = await usersRes.json();

      setCounts({
        products: productsData.total || 0,
        orders: ordersData.length || 0,
        categories: categoriesData.categories?.length || 0,
        users: usersData.total || 0,
      });
    } catch (err) {
      console.error("Lỗi khi lấy số liệu:", err);
    }
  };

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && !session?.user?.isAdmin)
    ) {
      router.push("/login");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.isAdmin) fetchCounts();
  }, [session]);

  if (status === "loading") {
    return <div className="p-6 text-gray-600">Đang kiểm tra quyền truy cập...</div>;
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  const menu = [
    { label: "📊 Thống kê doanh thu", href: "/Admin/dashboard" },
    { label: `📁 Quản lý danh mục (${counts.categories})`, href: "/Admin/categories" },
    { label: `🛒 Quản lý sản phẩm (${counts.products})`, href: "/Admin/products" },
    { label: `📦 Quản lý đơn hàng (${counts.orders})`, href: "/Admin/orders" },
    { label: `👤 Quản lý người dùng (${counts.users})`, href: "/Admin/users" },
  ];

  const enhancedChildren = isValidElement(children)
    ? cloneElement(children as ReactElement<any>, {
        fetchCounts,
        counts,
      })
    : children;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-white text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl hidden md:flex flex-col border-r border-gray-200 rounded-tr-3xl">
        <div className="px-8 py-6 text-2xl font-extrabold text-red-600 border-b border-gray-200">
          ⚙️ Admin Panel
        </div>
        <nav className="flex-1 px-6 py-6 space-y-3">
          {menu.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ease-in-out cursor-pointer shadow-sm
                ${
                  pathname === item.href
                    ? "bg-red-500 text-white shadow-md"
                    : "text-gray-800 hover:bg-red-100 hover:text-red-600"
                }`}
              >
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-6 py-8 md:px-10 bg-white rounded-tl-3xl shadow-inner">
        <div className="mb-8 pb-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Trang quản trị
          </h1>
          <div className="text-base text-gray-500">
            Xin chào, <span className="font-semibold text-red-600">{session?.user?.name || "Admin"}</span> 👋
          </div>
        </div>

        {enhancedChildren}
      </main>
    </div>
  );
};

export default AdminLayout;
