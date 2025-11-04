"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  isAdmin: boolean;
  emailVerified: string | null;
};

const UsersPage = () => {
  const searchParams = useSearchParams();
  const updatedId = searchParams.get("updatedId");

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async (search = "", page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        q: search,
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      const res = await fetch(`/api/admin/users?${queryParams.toString()}`);
      const data = await res.json();

      let fetchedUsers = data.users;

      if (updatedId) {
        const index = fetchedUsers.findIndex((u: User) => u.id === updatedId);
        if (index > -1) {
          const [updatedUser] = fetchedUsers.splice(index, 1);
          fetchedUsers = [updatedUser, ...fetchedUsers];
        }
      }

      setUsers(fetchedUsers);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
      setCurrentPage(data.page || page);
    } catch (error) {
      console.error("Không thể tải danh sách người dùng", error);
    }
  };

  useEffect(() => {
    fetchUsers(searchTerm, currentPage);
  }, [currentPage, searchTerm, updatedId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      fetchUsers(searchTerm, currentPage);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 font-sans bg-gradient-to-br from-white to-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-4xl font-bold text-red-600 tracking-wide flex items-center gap-2">
          <span>👥</span> Quản lý người dùng
        </h2>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Nhập tên hoặc email để tìm kiếm..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-6 py-3 border border-gray-300 rounded-3xl text-base shadow focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        />
      </div>

      <div className="overflow-x-auto rounded-3xl shadow-2xl bg-white">
        <table className="min-w-full text-base">
          <thead className="bg-gray-100 text-left text-base font-semibold text-gray-700">
            <tr>
              <th className="px-6 py-4">Ảnh</th>
              <th className="px-6 py-4">Tên</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Vai trò</th>
              <th className="px-6 py-4">Xác minh</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
              <th className="px-6 py-4 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500 text-base italic">
                  😔 Không tìm thấy người dùng nào.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-red-50 transition duration-200"
                >
                  <td className="px-6 py-4">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border shadow-sm"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-base font-medium">
                    {user.name || "Chưa đặt tên"}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.isAdmin ? "Admin" : "Người dùng"}
                  </td>
                  <td className="px-6 py-4">
                    {user.emailVerified ? (
                      <span className="text-green-600 font-semibold">✔ Đã xác minh</span>
                    ) : (
                      <span className="text-gray-500">Chưa</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-5">
                      <Link
                        href={`/Admin/users/update/${user.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition"
                      >
                        ✏️ Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/Admin/users/detail/${user.id}`}
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
              className={`px-4 py-2 rounded-full font-semibold transition duration-200 ${
                page === currentPage
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

export default UsersPage;
