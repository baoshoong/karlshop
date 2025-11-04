"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
};

type Option = {
  title: string;
  additionalPrice: number;
  quantity: number;
};

const AddPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
  });

  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
    quantity: 1,
  });

  const [options, setOptions] = useState<Option[]>([]);
  const [file, setFile] = useState<File | null>(null);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)] text-red-500 text-xl font-medium animate-pulse">
        Đang tải dữ liệu...
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

  const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === "additionalPrice" || e.target.name === "quantity"
        ? Number(e.target.value)
        : e.target.value,
    }));
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const item = e.target.files?.[0];
    if (item) setFile(item);
  };

  const upload = async () => {
    if (!file) return "";
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    if (!res.ok) throw new Error("Tải ảnh thất bại");
    const result = await res.json();
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await upload();
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputs, img: imageUrl, options }),
      });

      if (res.ok) {
        alert("🎉 Thêm sản phẩm thành công!");
        router.push(`/Admin/products`);
      } else {
        const data = await res.json();
        console.error("Thêm sản phẩm thất bại", data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeOption = (title: string) => {
    setOptions((prev) => prev.filter((opt) => opt.title !== title));
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl w-full flex flex-col gap-6 animate-fade-in"
      >
        <Link
          href="/Admin/products"
          className="text-sm text-red-500 hover:underline hover:text-red-600"
        >
          ← Trở về danh sách sản phẩm
        </Link>

        <h1 className="text-3xl font-bold text-red-600 border-b border-gray-200 pb-2">
          🛒 Thêm sản phẩm mới
        </h1>

        {/* Ảnh sản phẩm */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-lg">Hình ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleChangeImg}
            className="file:bg-red-500 file:text-white file:rounded-lg file:px-4 file:py-2 file:cursor-pointer border rounded-lg px-4 py-2"
          />
          {file && <span className="text-green-600 text-sm mt-1">📁 {file.name}</span>}
        </div>

        {/* Tên sản phẩm */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-lg">Tên sản phẩm</label>
          <input
            name="title"
            value={inputs.title}
            onChange={handleChange}
            required
            placeholder="Ví dụ: Tên sản phẩm, Áo, Quần, Phụ kiện, Giày..."
            className="border rounded-lg px-4 py-2 text-base"
          />
        </div>

        {/* Mô tả sản phẩm */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-lg">Mô tả sản phẩm</label>
          <textarea
            name="desc"
            value={inputs.desc}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Chi tiết về sản phẩm..."
            className="border rounded-lg px-4 py-2 text-base resize-y"
          />
        </div>

        {/* Giá và Danh mục */}
        <div className="flex gap-6 flex-wrap">
          <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
            <label className="font-semibold text-lg">Giá sản phẩm (VNĐ)</label>
            <input
              type="number"
              name="price"
              value={inputs.price}
              onChange={handleChange}
              min={0}
              className="border rounded-lg px-4 py-2 text-base"
            />
          </div>

          <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
            <label className="font-semibold text-lg">Danh mục (slug)</label>
            <input
              name="catSlug"
              value={inputs.catSlug}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Áo, Quần, Phụ kiện, Giày..."
              className="border rounded-lg px-4 py-2 text-base"
            />
          </div>
        </div>

        {/* Tùy chọn */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-lg">Tùy chọn (size, topping...)</label>
          <div className="flex flex-wrap gap-4">
            <input
              name="title"
              type="text"
              placeholder="Tên tùy chọn (ví dụ: Size M)"
              value={option.title}
              onChange={changeOption}
              className="border rounded-lg px-4 py-2 flex-grow min-w-[140px]"
            />
            <input
              name="additionalPrice"
              type="number"
              placeholder="Giá thêm"
              value={option.additionalPrice}
              onChange={changeOption}
              min={0}
              className="border rounded-lg px-4 py-2 w-32"
            />
            <input
              name="quantity"
              type="number"
              placeholder="Số lượng"
              value={option.quantity}
              onChange={changeOption}
              min={1}
              className="border rounded-lg px-4 py-2 w-24"
            />
            <button
              type="button"
              disabled={!option.title.trim()}
              onClick={() => {
                setOptions((prev) => [...prev, option]);
                setOption({ title: "", additionalPrice: 0, quantity: 1 });
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300"
            >
              ➕ Thêm tùy chọn
            </button>
          </div>

          {/* Danh sách tùy chọn đã thêm */}
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-200 transition"
                onClick={() => removeOption(item.title)}
                title="Nhấn để xóa tùy chọn"
              >
                <span className="font-semibold">{item.title}</span>
                <span>+ {item.additionalPrice.toLocaleString()}đ</span>
                <span>Số lượng: {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-red-500 to-red-600 text-white text-lg font-semibold py-3 rounded-xl hover:opacity-90 transition shadow-md"
        >
          ✅ Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddPage;
