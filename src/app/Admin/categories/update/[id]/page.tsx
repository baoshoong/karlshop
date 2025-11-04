"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Category = {
  title: string;
  desc: string;
  slug: string;
  color: string;
  img: string;
};

const UpdateCategoryPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [category, setCategory] = useState<Category>({
    title: "",
    desc: "",
    slug: "",
    color: "#f43f5e", // default red
    img: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        const data = await res.json();
        setCategory(data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (imgFile) setFile(imgFile);
  };

  const upload = async () => {
    const data = new FormData();
    data.append("file", file!);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    return result.url;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = category.img;
    if (file) {
      imageUrl = await upload();
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...category, img: imageUrl }),
      });

      if (res.ok) {
        alert("🎉 Cập nhật danh mục thành công!");
        router.push("/Admin/categories");
      } else {
        alert("❌ Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật danh mục:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-12 text-gray-500 text-lg animate-pulse">
        Đang tải dữ liệu danh mục...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-4 py-10">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-10 flex flex-col gap-6 transition-all duration-300"
      >
        <Link
          href="/Admin/categories"
          className="text-red-600 hover:text-red-700 font-semibold text-sm mb-2 inline-block transition"
        >
          ← Quay lại danh sách danh mục
        </Link>

        <h1 className="text-4xl font-bold text-center text-red-600 mb-4">
          Cập nhật danh mục
        </h1>

        {/* Ảnh */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[15px]">Ảnh danh mục</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-red-100 file:text-red-700 hover:file:bg-red-200 cursor-pointer transition"
          />
          {category.img && !file && (
            <Image
              src={category.img}
              alt="Preview"
              width={400}
              height={200}
              className="mt-3 rounded-xl object-cover border border-gray-200 shadow-md"
            />
          )}
          {file && (
            <p className="mt-2 text-green-600 text-sm">Tệp mới: {file.name}</p>
          )}
        </div>

        {/* Tên danh mục */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[15px]">Tên danh mục</label>
          <input
            name="title"
            value={category.title}
            onChange={handleChange}
            required
            placeholder="Nhập tên danh mục"
            className="border border-gray-300 rounded-xl px-4 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[15px]">Slug</label>
          <input
            name="slug"
            value={category.slug}
            onChange={handleChange}
            required
            placeholder="vd: do-uong, pizza, burger"
            className="border border-gray-300 rounded-xl px-4 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          />
        </div>

        {/* Mô tả */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[15px]">Mô tả</label>
          <textarea
            name="desc"
            value={category.desc}
            onChange={handleChange}
            rows={4}
            placeholder="Mô tả ngắn gọn về danh mục..."
            className="border border-gray-300 rounded-xl px-4 py-2 text-[15px] resize-y focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          />
        </div>

        {/* Màu sắc */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-[15px]">Màu hiển thị</label>
          <input
            type="color"
            name="color"
            value={category.color}
            onChange={handleChange}
            className="w-24 h-10 rounded-xl border border-gray-300 shadow-inner cursor-pointer"
          />
        </div>

        {/* Nút xác nhận */}
        <button
          type="submit"
          className="mt-2 bg-red-600 text-white py-3 rounded-xl font-semibold text-[16px] hover:bg-red-700 hover:shadow-lg transition duration-300"
        >
          ✅ Xác nhận cập nhật
        </button>
      </form>
    </div>
  );
};

export default UpdateCategoryPage;
