"use client";

import { ProductType } from "@/types/types";
import { useCartStore } from "@/utils/store";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Price = ({ product }: { product: ProductType }) => {
  const [total, setTotal] = useState(product.price);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);

  const { addToCart } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (product.options?.length) {
      setTotal(quantity * product.price + product.options[selected].additionalPrice);
    } else {
      setTotal(quantity * product.price);
    }
  }, [quantity, selected, product]);

  const maxQuantity = product.options?.[selected]?.quantity ?? 0;

  const handleCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      img: product.img,
      price: total,
      ...(product.options?.length && {
        optionTitle: product.options[selected].title,
      }),
      quantity: quantity,
    });
    toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  return (
    <div className="flex flex-col gap-6 text-[15px] sm:text-base">
      {/* Giá */}
      <h2 className="text-2xl font-bold text-red-600 tracking-wide">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(total)}
      </h2>

      {/* Tuỳ chọn sản phẩm */}
      {Array.isArray(product.options) && product.options.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {product.options.map((option, index) => (
            <button
              key={option.title}
              className={`min-w-[6rem] px-4 py-2 rounded-xl border transition-all duration-200 shadow-sm font-medium text-sm 
                ${selected === index
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-red-500 border-red-400 hover:bg-red-50"
                }`}
              onClick={() => {
                setSelected(index);
                setQuantity(1);
              }}
            >
              {option.title}
            </button>
          ))}
        </div>
      )}

      {/* Nếu hết hàng */}
      {maxQuantity === 0 ? (
        <div className="text-lg font-semibold text-red-600 mt-2">Hết hàng</div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-4">
          {/* Chọn số lượng */}
          <div className="flex items-center justify-between w-full sm:w-[60%] px-4 py-3 border border-red-400 rounded-xl shadow-sm bg-white">
            <span className="font-medium text-gray-700">Số lượng</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                className="px-3 py-1 rounded-full border border-red-400 text-red-500 hover:bg-red-50 transition"
              >
                &lt;
              </button>
              <span className="font-semibold text-gray-800">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => (prev < maxQuantity ? prev + 1 : prev))}
                className="px-3 py-1 rounded-full border border-red-400 text-red-500 hover:bg-red-50 transition"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Nút Thêm vào giỏ */}
          <button
            className="uppercase w-full sm:w-56 bg-red-500 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:bg-red-600 transition"
            onClick={handleCart}
          >
            Thêm vào giỏ
          </button>
        </div>
      )}
    </div>
  );
};

export default Price;
