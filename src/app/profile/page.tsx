"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState(""); // base64 hoặc URL
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await axios.put("/api/profile", { name, image });
      await update();
      alert("✅ Đã cập nhật thành công!");
    } catch (err) {
      alert("❌ Lỗi khi cập nhật!");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading")
    return <div className="text-center mt-10 text-gray-600 text-base">Đang tải...</div>;
  if (!session)
    return <div className="text-center mt-10 text-red-600 text-base">Vui lòng đăng nhập</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto mt-12 bg-gradient-to-tr from-white to-blue-50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-blue-200">
      <h1 className="text-4xl font-bold text-blue-700 mb-12 text-center tracking-wide leading-tight drop-shadow-sm">
        ✨ Hồ sơ cá nhân
      </h1>

      {image && (
        <div className="flex justify-center mb-10">
          <div className="relative w-[140px] h-[140px] rounded-full overflow-hidden shadow-lg border-4 border-white ring-4 ring-blue-300 transition-all duration-300 hover:scale-105 bg-white">
            <Image
              src={image}
              alt="Ảnh đại diện"
              fill
              className="object-cover transition-all duration-500"
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tên hiển thị</label>
        <input
          type="text"
          className="border border-gray-300 rounded-xl px-4 py-3 w-full text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên hiển thị..."
        />
      </div>

      <div className="mb-10">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn ảnh đại diện</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className={`w-full py-3 px-6 text-white text-[16px] font-semibold rounded-xl shadow-lg transform transition-all duration-200 ${
          saving
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        }`}
      >
        {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
      </button>
    </div>
  );
}
