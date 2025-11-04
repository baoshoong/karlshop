"use client";

import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import Image from "next/image";
import AddressForm from "./AddressForm";

type CheckoutFormProps = {
  orderId: string;
};

const CheckoutForm = ({ orderId }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod" | "qr">("stripe");

  useEffect(() => {
    if (!stripe) return;
    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("✅ Thanh toán thành công!");
          break;
        case "processing":
          setMessage("⏳ Đang xử lý thanh toán...");
          break;
        case "requires_payment_method":
          setMessage("⚠️ Thanh toán thất bại. Vui lòng thử lại.");
          break;
        default:
          setMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userAddress) {
      setMessage("🚚 Vui lòng nhập địa chỉ giao hàng.");
      return;
    }

    await fetch(`/api/orders/${orderId}/address`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: userAddress }),
    });

    if (paymentMethod === "stripe") {
      if (!stripe || !elements) return;
      setIsLoading(true);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `http://localhost:3000/success?orderId=${orderId}`,
        },
      });

      if (error?.type === "card_error" || error?.type === "validation_error") {
        setMessage(error.message || "Đã xảy ra lỗi trong quá trình thanh toán.");
      } else if (!error) {
        // Stripe tự chuyển trang
      } else {
        setMessage("Lỗi không xác định. Vui lòng thử lại.");
      }

      setIsLoading(false);
    } else {
      // COD or QR
      window.location.href = `http://localhost:3000/success?orderId=${orderId}`;
    }
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="grid md:grid-cols-2 gap-6 bg-white"
    >
      {/* Cột chọn phương thức và thanh toán */}
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 text-[16px] font-semibold text-gray-700">
          {[
            { value: "stripe", label: "💳 Thẻ (Stripe)" },
            { value: "cod", label: "📦 Khi nhận hàng (COD)" },
            { value: "qr", label: "🏦 QR Banking" },
          ].map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 
                ${paymentMethod === value ? "bg-red-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              <input
                type="radio"
                value={value}
                checked={paymentMethod === value}
                onChange={() => setPaymentMethod(value as any)}
                className="hidden"
              />
              {label}
            </label>
          ))}
        </div>

        {paymentMethod === "stripe" && (
          <div className="space-y-4 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <LinkAuthenticationElement id="link-authentication-element" />
            <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
          </div>
        )}

        {paymentMethod === "qr" && (
          <div className="space-y-4 border border-gray-200 rounded-2xl p-6 shadow-sm bg-white">
            <div>
              <p className="font-semibold text-gray-800 text-lg">📷 Quét mã QR để chuyển khoản:</p>
              <Image
                src="/temporary/bank-qr.png"
                alt="QR Code"
                width={288}
                height={288}
                className="w-72 h-auto object-contain border rounded-xl shadow-md mt-4"
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl text-sm text-yellow-800 shadow-sm">
              <p className="font-semibold">📌 Lưu ý:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  Ghi <strong>đúng nội dung</strong> chuyển khoản: <span className="font-bold text-red-600">Thanh toan don hang #{orderId}</span>
                </li>
                <li>
                  Sai nội dung sẽ <strong>không được xác nhận tự động</strong>.
                </li>
              </ul>
            </div>
          </div>
        )}

        {paymentMethod === "cod" && (
          <div className="space-y-4 border border-gray-200 rounded-2xl p-6 shadow-sm bg-white">
            <p className="text-gray-800 font-semibold text-lg">📦 Bạn đã chọn hình thức thanh toán khi nhận hàng (COD).</p>
            <div className="bg-green-50 border border-green-300 p-4 rounded-xl text-sm text-green-800 shadow-sm">
              <p className="font-semibold">✅ Đơn hàng của bạn sẽ được xử lý và giao đến địa chỉ đã nhập.</p>
              <p className="mt-2">Vui lòng chuẩn bị tiền mặt để thanh toán khi nhận hàng.</p>
            </div>
          </div>
        )}
      </div>

      {/* Cột địa chỉ và nút submit */}
      <div className="flex flex-col justify-between space-y-6">
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
          <AddressForm onAddressChange={setUserAddress} />
        </div>

        <div className="flex justify-center">
          <button
            disabled={isLoading || (paymentMethod === "stripe" && (!stripe || !elements))}
            id="submit"
            className={`bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full shadow-md transition-all duration-300 
              font-bold text-lg ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Đang xử lý..." : "Thanh toán"}
          </button>
        </div>

        {message && (
          <div className="text-center text-base text-blue-700 font-medium bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm">
            {message}
          </div>
        )}
      </div>
    </form>
  );
};

export default CheckoutForm;
