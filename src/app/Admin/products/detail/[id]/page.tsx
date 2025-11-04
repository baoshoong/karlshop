"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: string;
  title: string;
  desc: string;
  price: number;
  catSlug: string;
  img?: string;
  options?: { title: string; additionalPrice: number; quantity: number }[];
};

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    const laySanPham = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setDangTai(false);
      }
    };

    laySanPham();
  }, [id]);

  if (dangTai)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)] text-red-500 text-lg animate-pulse">
        Đang tải thông tin sản phẩm...
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-6rem)] text-gray-500 gap-4">
        <p className="text-base">Không tìm thấy sản phẩm phù hợp.</p>
        <button
          onClick={() => router.back()}
          className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-md text-base font-medium"
        >
          Quay lại
        </button>
      </div>
    );

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-3xl mt-8 transition-all duration-300">
      <button
        onClick={() => router.back()}
        className="mb-6 text-red-500 hover:text-red-600 text-base transition-all duration-200"
      >
        &larr; Quay lại danh sách sản phẩm
      </button>

      <h1 className="text-3xl sm:text-4xl font-extrabold mb-5 text-red-600 tracking-tight leading-tight">
        {product.title}
      </h1>

      {product.img ? (
        <img
          src={product.img}
          alt={product.title}
          className="w-full max-h-[500px] object-contain rounded-2xl mb-6 shadow-md transition-all duration-300"
        />
      ) : (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 mb-6 rounded-xl shadow-inner text-base">
          Chưa có hình ảnh minh họa
        </div>
      )}

      <p className="mb-8 text-gray-700 leading-relaxed text-base whitespace-pre-line">
        {product.desc}
      </p>

      <div className="flex flex-wrap gap-6 mb-8">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 mb-1">Giá bán</h3>
          <p className="text-red-600 text-2xl font-bold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(product.price)}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-gray-800 mb-1">Danh mục</h3>
          <p className="text-gray-600 capitalize text-base">{product.catSlug}</p>
        </div>
      </div>

      {product.options && product.options.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg text-gray-800 mb-3">Các tuỳ chọn kèm theo</h3>
          <ul className="list-disc ml-6 space-y-2 text-base text-gray-700">
            {product.options.map((opt) => (
              <li key={opt.title}>
                <span className="font-medium">{opt.title}</span>{" "}
                <span className="text-gray-600">(Số lượng: {opt.quantity})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
