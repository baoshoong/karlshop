"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { category: string };
};

const CategoryPage = ({ params }: Props) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(9);
  const [total, setTotal] = useState<number>(0);

  const fetchProducts = async (
    search = "",
    minP = "",
    maxP = "",
    pageNum = 1
  ) => {
    try {
      let url = `/api/products?cat=${params.category}&q=${encodeURIComponent(search)}&page=${pageNum}&limit=${limit}`;
      if (minP) url += `&minPrice=${encodeURIComponent(minP)}`;
      if (maxP) url += `&maxPrice=${encodeURIComponent(maxP)}`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Không thể lấy danh sách sản phẩm");

      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total);
      setPage(data.page);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm, minPrice, maxPrice, page);
  }, [params.category, page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(searchTerm, minPrice, maxPrice, 1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen text-blue-900">
      {/* Form tìm kiếm */}
      <form
        onSubmit={handleSearch}
        className="mb-12 max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-4"
      >
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow min-w-[220px] px-4 py-3 text-base rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-300"
        />
        <input
          type="number"
          min={0}
          placeholder="Giá từ"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-28 px-3 py-3 text-base rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-300"
        />
        <input
          type="number"
          min={0}
          placeholder="Đến"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-28 px-3 py-3 text-base rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-300"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl shadow-md transition duration-300"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
        ) : (
          products.map((item) => (
            <Link
              href={`/product/${item.id}`}
              key={item.id}
              className="group bg-white border border-orange-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Hình ảnh */}
              {item.img && (
                <div className="relative h-60 sm:h-64 rounded-xl overflow-hidden mb-4 bg-white shadow-inner">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Nội dung */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold uppercase truncate">
                  {item.title}
                </h2>
                <h3 className="text-base font-medium text-blue-700 group-hover:hidden">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.price)}
                </h3>
                <button className="hidden group-hover:block text-sm sm:text-base bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300">
                  Thêm vào giỏ
                </button>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-12 text-base sm:text-lg">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 rounded-xl font-medium border ${page <= 1
                ? "text-gray-300 border-gray-300 cursor-not-allowed"
                : "text-orange-600 border-orange-400 hover:bg-orange-500 hover:text-white transition"
              }`}
          >
            ← Trước
          </button>
          <span className="font-medium text-gray-600">
            Trang {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className={`px-4 py-2 rounded-xl font-medium border ${page >= totalPages
                ? "text-gray-300 border-gray-300 cursor-not-allowed"
                : "text-orange-600 border-orange-400 hover:bg-orange-500 hover:text-white transition"
              }`}
          >
            Tiếp →
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
