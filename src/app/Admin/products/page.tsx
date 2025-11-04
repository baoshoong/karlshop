"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Product = {
  id: string;
  title: string;
  price: number;
  catSlug: string;
};

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const updatedId = searchParams.get("updatedId");

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const fetchProducts = async (search = "", page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        all: "true",
        q: search,
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();

      let fetchedProducts = data.products;

      if (updatedId) {
        const index = fetchedProducts.findIndex((p: Product) => p.id === updatedId);
        if (index > -1) {
          const [updatedProduct] = fetchedProducts.splice(index, 1);
          fetchedProducts = [updatedProduct, ...fetchedProducts];
        }
      }

      setProducts(fetchedProducts);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
      setCurrentPage(data.page);
    } catch (error) {
      console.error("Không thể tải danh sách sản phẩm", error);
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm, currentPage);
  }, [currentPage, searchTerm, updatedId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts(searchTerm, currentPage);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 font-sans bg-gradient-to-br from-white to-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-4xl font-bold text-red-600 tracking-wide flex items-center gap-2">
          <span>🛒</span> Quản lý sản phẩm
        </h2>
        <Link
          href="/Admin/products/add"
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl shadow-lg text-base font-semibold transition-transform transform hover:scale-105"
        >
          + Thêm sản phẩm mới
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Nhập tên sản phẩm để tìm kiếm..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-6 py-3 border border-gray-300 rounded-3xl text-base shadow focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        />
      </div>

      <div className="overflow-x-auto rounded-3xl shadow-2xl bg-white">
        <table className="min-w-full text-base">
          <thead className="bg-gray-100 text-left text-base font-semibold text-gray-700">
            <tr>
              <th className="px-6 py-4">Tên sản phẩm</th>
              <th className="px-6 py-4">Giá bán</th>
              <th className="px-6 py-4">Danh mục</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
              <th className="px-6 py-4 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500 text-base italic">
                  😔 Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-red-50 transition duration-200"
                >
                  <td className="px-6 py-4">{product.title}</td>
                  <td className="px-6 py-4 font-semibold text-red-600">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                  </td>
                  <td className="px-6 py-4 capitalize">{product.catSlug}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-5">
                      <Link
                        href={`/Admin/products/update/${product.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition"
                      >
                        ✏️ Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/Admin/products/detail/${product.id}`}
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-full font-semibold transition duration-200 ${page === currentPage
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

export default ProductsPage;
