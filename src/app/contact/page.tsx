import React from "react";

const ContactPage = () => {
  const project = {
    title: "Tìm hiểu và Phát triển Website Bán hàng Thời trang",
    advisor: "Đặng Linh Phú",
    duration: "Từ 00/00/2025 đến 00/00/2025",
    groupNumber: 27,
  };

  const students = [
    { name: "Phạm Hoàng Long", studentId: "22119472" },
    { name: "Đoàn Thị Nguyên Sa", studentId: "22206271" },
    { name: "Huỳnh Gia Bảo", studentId: "22118978" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white flex flex-col items-center py-20 px-6 font-sans">
      <div className="max-w-4xl w-full bg-white shadow-lg hover:shadow-xl transition-all duration-500 rounded-3xl p-12 border border-blue-100">
        {/* Header */}
        <header className="text-center mb-14">
          <p className="text-base md:text-lg font-semibold text-blue-700 tracking-widest">
            BỘ GIÁO DỤC VÀ ĐÀO TẠO
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-900 mt-2">
            TRƯỜNG ĐẠI HỌC HOA SEN
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-blue-800 mt-1">
            KHOA CÔNG NGHỆ THÔNG TIN
          </h2>
          <hr className="border-blue-300 mt-6 w-1/2 mx-auto" />
        </header>

        {/* Project Title */}
        <section className="mb-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Tên đề tài
          </h3>
          <p className="text-xl md:text-2xl font-semibold text-orange-600 leading-relaxed">
            {project.title}
          </p>
        </section>

        {/* Project Details */}
        <section className="mb-14 space-y-6 text-base md:text-lg text-gray-700">
          <div className="flex justify-between border-b border-blue-100 pb-3">
            <span className="font-semibold text-blue-900">Giảng viên hướng dẫn:</span>
            <span>{project.advisor}</span>
          </div>
          <div className="flex justify-between border-b border-blue-100 pb-3">
            <span className="font-semibold text-blue-900">Thời gian thực hiện:</span>
            <span>{project.duration}</span>
          </div>
          <div className="flex justify-between border-b border-blue-100 pb-3">
            <span className="font-semibold text-blue-900">Số nhóm:</span>
            <span>{project.groupNumber}</span>
          </div>
        </section>

        {/* Students Table */}
        <section>
          <h4 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
            Nhóm sinh viên thực hiện
          </h4>
          <div className="overflow-hidden rounded-2xl shadow-md border border-blue-200">
            <table className="w-full border-collapse text-base md:text-lg">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border border-blue-300 py-4 px-6 text-left text-blue-900 font-bold">
                    Họ và tên
                  </th>
                  <th className="border border-blue-300 py-4 px-6 text-left text-blue-900 font-bold">
                    MSSV
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr
                    key={idx}
                    className={`transition-all duration-300 ${
                      idx % 2 === 0 ? "bg-blue-50" : "bg-white"
                    } hover:bg-blue-200 hover:scale-[1.005]`}
                  >
                    <td className="border border-blue-300 py-4 px-6">
                      {student.name}
                    </td>
                    <td className="border border-blue-300 py-4 px-6">
                      {student.studentId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
