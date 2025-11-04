"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserRoundCheck, UserRoundX, Loader2 } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
};

const UpdateUserPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu người dùng");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)] text-red-600 text-xl">
        <Loader2 className="animate-spin mr-2" />
        Đang tải dữ liệu...
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user?.isAdmin) {
    router.push("/login");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setUser({ ...user, [name]: newValue });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file!);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let imageUrl = user.image;
    if (file) {
      imageUrl = await upload();
    }

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, image: imageUrl }),
      });

      if (res.ok) {
        alert("Cập nhật người dùng thành công!");
        router.push("/Admin/users");
      } else {
        console.error("Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-gray-50 px-4 py-10">
      <form
        className="w-full max-w-3xl bg-white border border-gray-200 rounded-3xl shadow-xl px-8 py-10 space-y-6 transition-all duration-300"
        onSubmit={handleSubmit}
      >
        <Link
          href="/Admin/users"
          className="text-sm text-red-500 hover:underline hover:text-red-700 transition"
        >
          ← Quay lại danh sách người dùng
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-center text-red-600">
          Cập nhật người dùng
        </h1>

        {user && (
          <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 shadow-inner">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Thông tin hiện tại</h2>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full text-sm">
                  Không có ảnh
                </div>
              )}
              <div className="space-y-1 text-gray-700">
                <p><strong>Tên:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p className="flex items-center gap-1">
                  <strong>Vai trò:</strong>
                  {user.isAdmin ? (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <UserRoundCheck className="w-5 h-5" /> Quản trị viên
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <UserRoundX className="w-5 h-5" /> Người dùng
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Ảnh đại diện mới</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-xl px-4 py-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 transition"
          />
          {file && (
            <p className="text-sm text-green-600 mt-1">Tệp mới: {file.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Tên người dùng</label>
          <input
            type="text"
            name="name"
            value={user?.name || ""}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-300 outline-none transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user?.email || ""}
            disabled
            className="border border-gray-200 rounded-xl px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isAdmin"
            checked={user?.isAdmin || false}
            onChange={handleChange}
            className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-400"
          />
          <label htmlFor="isAdmin" className="font-medium text-gray-700">
            Là quản trị viên
          </label>
        </div>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95"
        >
          Xác nhận cập nhật
        </button>
      </form>
    </div>
  );
};

export default UpdateUserPage;
