// app/Admin/categories/detail/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: string;
  title: string;
  desc: string;
  color: string;
  img: string;
  slug: string;
  createdAt: string;
};

const DetailCategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (!res.ok) throw new Error("Lỗi khi tải danh mục");
        const data = await res.json();
        setCategory(data);
      } catch (err) {
        console.error(err);
        alert("Không thể tải danh mục");
        router.push("/Admin/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)] text-red-500 text-lg font-medium animate-pulse">
        Đang tải chi tiết danh mục...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center text-red-600 font-semibold mt-10 text-lg">
        Không tìm thấy danh mục.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 transition-all duration-300">
        <Link
          href="/Admin/categories"
          className="text-red-600 hover:text-red-700 hover:underline transition duration-200 text-base font-medium mb-6 inline-block"
        >
          ← Quay lại danh sách
        </Link>

        <h1 className="text-4xl font-extrabold text-red-600 mb-8 border-b border-gray-200 pb-4">
          {category.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-5 text-gray-700 text-[17px] leading-relaxed">
            <p>
              <span className="font-semibold text-gray-800">🆔 ID:</span>{" "}
              {category.id}
            </p>
            <p>
              <span className="font-semibold text-gray-800">🔗 Slug:</span>{" "}
              {category.slug}
            </p>
            <p>
              <span className="font-semibold text-gray-800">📄 Mô tả:</span>{" "}
              {category.desc}
            </p>
            <p className="flex items-center gap-3">
              <span className="font-semibold text-gray-800">🎨 Màu sắc:</span>
              <span
                className="inline-block w-7 h-7 rounded-full border border-gray-300 shadow-sm"
                style={{ backgroundColor: category.color }}
                title={category.color}
              ></span>
              <span>{category.color}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-800">📅 Ngày tạo:</span>{" "}
              {new Date(category.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="flex justify-center items-center">
            <img
              src={category.img}
              alt={category.title}
              className="w-full max-w-xs rounded-xl border border-gray-300 shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCategoryPage;
