"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
  img?: string;
};

type Option = {
  title: string;
  additionalPrice: number;
  quantity: number;
};

const UpdatePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
    img: "",
  });

  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
    quantity: 1,
  });

  const [options, setOptions] = useState<Option[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setInputs({
        title: data.title,
        desc: data.desc,
        price: data.price,
        catSlug: data.catSlug,
        img: data.img,
      });
      setOptions(data.options || []);
    };

    if (id) fetchProduct();
  }, [id]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)] text-red-500 text-lg animate-pulse">
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
      [e.target.name]:
        e.target.name === "additionalPrice" || e.target.name === "quantity"
          ? Number(e.target.value)
          : e.target.value,
    }));
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const item = e.target.files?.[0];
    if (item) setFile(item);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = inputs.img;
    if (file) {
      imageUrl = await upload();
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, img: imageUrl, options }),
      });

      if (res.ok) {
        alert("🎉 Cập nhật sản phẩm thành công!");
        router.push(`/Admin/products?updatedId=${id}`);
      } else {
        alert("❌ Đã xảy ra lỗi khi cập nhật sản phẩm.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeOption = (title: string) => {
    setOptions((prev) => prev.filter((opt) => opt.title !== title));
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-red-100/30 to-white flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl px-10 py-12 space-y-6 border border-red-200 animate-fade-in"
      >
        <Link
          href="/Admin/products"
          className="text-red-600 hover:text-red-800 text-sm font-semibold"
        >
          ← Quay lại danh sách sản phẩm
        </Link>

        <h1 className="text-4xl font-extrabold text-red-600 text-center tracking-tight">
          Cập nhật sản phẩm
        </h1>

        {/* Hình ảnh */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Hình ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleChangeImg}
            className="w-full border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          {inputs.img && !file && (
            <img
              src={inputs.img}
              alt="Ảnh hiện tại"
              className="mt-3 max-h-52 rounded-2xl object-cover shadow-lg border"
            />
          )}
          {file && (
            <p className="text-green-600 text-sm font-medium">📂 {file.name}</p>
          )}
        </div>

        {/* Tên sản phẩm */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Tên sản phẩm</label>
          <input
            name="title"
            value={inputs.title}
            onChange={handleChange}
            required
            placeholder="Nhập tên sản phẩm..."
            className="w-full border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Mô tả sản phẩm */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Mô tả</label>
          <textarea
            name="desc"
            rows={4}
            value={inputs.desc}
            onChange={handleChange}
            required
            placeholder="Mô tả chi tiết sản phẩm..."
            className="w-full border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-y"
          />
        </div>

        {/* Giá và slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Giá bán (VNĐ)</label>
            <input
              name="price"
              type="number"
              min={0}
              value={inputs.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Slug danh mục</label>
            <input
              name="catSlug"
              value={inputs.catSlug}
              onChange={handleChange}
              required
              placeholder="ví dụ: thuc-an, do-uong"
              className="w-full border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
        </div>

        {/* Tùy chọn sản phẩm */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tùy chọn thêm</label>
          <div className="flex flex-wrap gap-2">
            <input
              name="title"
              value={option.title}
              onChange={changeOption}
              placeholder="Tên tùy chọn"
              className="border border-gray-300 rounded-2xl px-4 py-2 text-sm w-full sm:w-auto flex-grow focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              name="additionalPrice"
              type="number"
              min={0}
              value={option.additionalPrice}
              onChange={changeOption}
              placeholder="Giá thêm"
              className="border border-gray-300 rounded-2xl px-4 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              name="quantity"
              type="number"
              min={1}
              value={option.quantity}
              onChange={changeOption}
              placeholder="Số lượng"
              className="border border-gray-300 rounded-2xl px-4 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              type="button"
              onClick={() => {
                setOptions([...options, option]);
                setOption({ title: "", additionalPrice: 0, quantity: 1 });
              }}
              disabled={!option.title.trim()}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-2xl transition disabled:bg-gray-300"
            >
              Thêm
            </button>
          </div>

          {/* Hiển thị danh sách tùy chọn */}
          <div className="flex flex-wrap gap-3 mt-4">
            {options.map((opt) => (
              <div
                key={opt.title}
                onClick={() => removeOption(opt.title)}
                className="flex items-center gap-2 bg-red-100 border border-red-300 px-3 py-2 rounded-xl text-sm cursor-pointer hover:bg-red-200 transition"
                title="Nhấn để xóa"
              >
                <span className="font-semibold">{opt.title}</span>
                <span className="text-red-600 font-bold">
                  +{opt.additionalPrice.toFixed(0)}₫
                </span>
                <span>Số lượng: {opt.quantity}</span>
                <span className="text-red-500 font-extrabold">×</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nút cập nhật */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl transition text-lg shadow-md"
        >
          ✅ Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
};

export default UpdatePage;
