"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";

type CategoryInputs = {
  title: string;
  desc: string;
  color: string;
  slug: string;
  img: string;
};

const AddCategoryPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [inputs, setInputs] = useState<Omit<CategoryInputs, "img">>({
    title: "",
    desc: "",
    color: "#000000",
    slug: "",
  });
  const [file, setFile] = useState<File | null>(null);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)] text-red-500 text-lg font-medium">
        Đang tải...
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/login");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const uploadImage = async () => {
    if (!file) return "";
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });
    if (!res.ok) throw new Error("Tải ảnh thất bại");
    const result = await res.json();
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrl = await uploadImage();
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputs, img: imageUrl }),
      });

      if (res.ok) {
        alert("Thêm danh mục thành công!");
        router.push("/Admin/categories");
      } else {
        const errorData = await res.json();
        console.error("Lỗi khi thêm:", errorData);
      }
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl px-10 py-12 w-full max-w-2xl flex flex-col gap-8 transition-all duration-300"
      >
        <Link
          href="/Admin/categories"
          className="text-red-500 hover:text-red-600 text-sm font-medium transition duration-200 hover:underline"
        >
          ← Quay lại danh sách
        </Link>

        <h1 className="text-4xl font-bold text-red-600 mb-2 tracking-tight">
          Thêm danh mục mới
        </h1>

        {/* Tên danh mục */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-base text-gray-700">
            Tên danh mục
          </label>
          <input
            type="text"
            name="title"
            value={inputs.title}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
            placeholder="VD: Quần, Áo, Giày..."
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-base text-gray-700">
            Slug (đường dẫn)
          </label>
          <input
            type="text"
            name="slug"
            value={inputs.slug}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
            placeholder="VD: quan, ao, giay..."
          />
        </div>

        {/* Mô tả */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-base text-gray-700">
            Mô tả
          </label>
          <textarea
            name="desc"
            value={inputs.desc}
            onChange={handleChange}
            required
            rows={4}
            className="border border-gray-300 rounded-xl px-5 py-3 text-base resize-y focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
            placeholder="Mô tả chi tiết về danh mục này"
          />
        </div>

        {/* Màu sắc */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-base text-gray-700">
            Màu hiển thị
          </label>
          <input
            type="color"
            name="color"
            value={inputs.color}
            onChange={handleChange}
            className="w-20 h-10 border border-gray-300 rounded-xl cursor-pointer"
          />
        </div>

        {/* Ảnh */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-base text-gray-700">
            Ảnh danh mục
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="border border-gray-300 rounded-xl px-3 py-2 file:mr-4 file:py-2 file:px-5 file:rounded-lg file:border-0 file:bg-red-500 file:text-white hover:file:bg-red-600 transition duration-200 cursor-pointer"
          />
          {file && (
            <p className="text-green-600 text-sm mt-1">
              Đã chọn: {file.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white py-3 rounded-xl text-base font-semibold hover:bg-red-700 hover:shadow-lg transition duration-200"
        >
          Xác nhận thêm danh mục
        </button>
      </form>
    </div>
  );
};

export default AddCategoryPage;
