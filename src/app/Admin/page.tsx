const AdminDashboard = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2 flex items-center gap-2">
          📊 Bảng điều khiển
        </h2>
        <p className="text-base text-gray-600 leading-relaxed">
          Chào mừng bạn đến với khu vực quản trị. Tại đây, bạn có thể:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1 text-sm">
          <li>👀 Theo dõi hiệu suất bán hàng và số liệu thống kê</li>
          <li>📦 Quản lý đơn hàng và sản phẩm</li>
          <li>🧾 Duyệt danh mục và người dùng</li>
        </ul>
      </div>

      {/* Gợi ý: Có thể thêm box thống kê tổng quan ở đây nếu muốn */}
    </div>
  );
};

export default AdminDashboard;
