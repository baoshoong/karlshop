"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  isAdmin: boolean;
  emailVerified: string | null;
};

const UserDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu người dùng");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)] text-red-500 text-xl font-semibold animate-pulse">
        Đang tải thông tin người dùng...
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-6rem)] text-gray-500 text-lg">
        <p className="mb-3">Không tìm thấy người dùng.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 rounded-full bg-red-500 text-white text-base shadow-lg hover:bg-red-600 transition-all duration-300"
        >
          Quay lại
        </button>
      </div>
    );

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white shadow-xl rounded-3xl mt-10 transition-all duration-300">
      <button
        onClick={() => router.back()}
        className="mb-6 text-red-500 hover:text-red-600 hover:underline text-base font-medium transition"
      >
        &larr; Quay lại danh sách người dùng
      </button>

      <h1 className="text-4xl font-extrabold mb-10 text-red-600 tracking-wide text-center">
        Chi tiết người dùng
      </h1>

      {user.image ? (
        <img
          src={user.image}
          alt={user.name || "Avatar"}
          className="w-36 h-36 object-cover rounded-full mx-auto mb-6 border border-gray-300 shadow-md transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <div className="w-36 h-36 mx-auto bg-gray-100 flex items-center justify-center text-gray-400 rounded-full mb-6 shadow-inner text-sm">
          Không có ảnh
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800 px-4 md:px-8">
        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-600">👤 Tên người dùng</h3>
          <p className="text-[17px] text-gray-800">{user.name || "Chưa đặt tên"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-600">📧 Email</h3>
          <p className="text-[17px] text-gray-800">{user.email}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-600">🛡️ Quản trị viên</h3>
          <p className="text-[17px]">
            {user.isAdmin ? (
              <span className="text-green-600 font-semibold">✔️ Có</span>
            ) : (
              <span className="text-gray-500">❌ Không</span>
            )}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-600">✅ Trạng thái Email</h3>
          <p className="text-[17px]">
            {user.emailVerified ? (
              <span className="text-green-600">Đã xác minh</span>
            ) : (
              <span className="text-gray-500">Chưa xác minh</span>
            )}
          </p>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-semibold text-lg mb-2 text-gray-600">🆔 ID Người dùng</h3>
          <p className="text-sm text-gray-700 break-all bg-gray-50 p-3 rounded-lg shadow-inner font-mono">
            {user.id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
