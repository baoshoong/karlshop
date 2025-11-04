"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Category = {
  id: string;
  title: string;
  slug: string;
  desc: string;
  color: string;
  img: string;
  products: { id: string }[];
};

const CategoryPage = () => {
  const searchParams = useSearchParams();
  const updatedId = searchParams.get("updatedId");

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const fetchCategories = async (search = "", page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        q: search,
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      const res = await fetch(`/api/categories?${queryParams.toString()}`);
      const data = await res.json();

      let fetchedCategories = data.categories;

      if (updatedId) {
        const index = fetchedCategories.findIndex(
          (c: Category) => c.id === updatedId
        );
        if (index > -1) {
          const [updatedCategory] = fetchedCategories.splice(index, 1);
          fetchedCategories = [updatedCategory, ...fetchedCategories];
        }
      }

      setCategories(fetchedCategories);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
      setCurrentPage(data.page);
    } catch (error) {
      console.error("Không thể tải danh mục", error);
    }
  };

  useEffect(() => {
    fetchCategories(searchTerm, currentPage);
  }, [currentPage, searchTerm, updatedId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      fetchCategories(searchTerm, currentPage);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 sm:p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">📁 Danh mục sản phẩm</h2>
        <Link
          href="/Admin/categories/add"
          className="bg-red-500 text-white px-6 py-2.5 rounded-2xl shadow-md hover:bg-red-600 hover:shadow-lg transition duration-200 ease-in-out"
        >
          + Thêm danh mục
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm danh mục theo tên..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-xl bg-white">
        <table className="min-w-full text-sm sm:text-base text-gray-800">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 text-left">Hình ảnh</th>
              <th className="px-5 py-3 text-left">Tên danh mục</th>
              <th className="px-5 py-3 text-left">Slug</th>
              <th className="px-5 py-3 text-left">Mô tả</th>
              <th className="px-5 py-3 text-left">Màu</th>
              <th className="px-5 py-3 text-center">Sản phẩm</th>
              <th className="px-5 py-3 text-center">Hành động</th>
              <th className="px-5 py-3 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {(!categories || categories.length === 0) ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  Không tìm thấy danh mục nào.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-5 py-4">
                    <img
                      src={category.img}
                      alt={category.title}
                      className="w-14 h-14 object-cover rounded-lg shadow-sm border"
                    />
                  </td>
                  <td className="px-5 py-4 font-semibold whitespace-nowrap">
                    {category.title}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{category.slug}</td>
                  <td className="px-5 py-4 max-w-sm truncate">{category.desc}</td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-block w-6 h-6 rounded-full border shadow-inner"
                      style={{ backgroundColor: category.color }}
                      title={category.color}
                    ></span>
                  </td>
                  <td className="px-5 py-4 text-center font-medium">
                    {category.products.length}
                  </td>
                  <td className="px-5 py-4 flex gap-3 justify-center">
                    <Link
                      href={`/Admin/categories/update/${category.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      ✏️ Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition"
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link
                      href={`/Admin/categories/detail/${category.id}`}
                      className="text-green-600 hover:text-green-800 font-medium transition"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition duration-200 shadow-sm ${
                page === currentPage
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
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

export default CategoryPage;
