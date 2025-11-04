"use client";

import { useEffect, useRef, useState } from "react";
import { getCurrentUserOrders } from "@/utils/orderActions";

// Biểu tượng (SVG) cho nút gửi - gọn gàng và hiện đại hơn
const SendIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.47826 2.40015L20.5217 10.9255C21.6087 11.4588 21.6087 12.5415 20.5217 13.0748L3.47826 21.6001C2.52174 22.0668 1.5 21.3415 1.5 20.2501V15.5001L8.5 12.0001L1.5 8.50015V3.75015C1.5 2.65882 2.52174 1.93348 3.47826 2.40015Z"
      fill="currentColor"
    />
  </svg>
);

// Biểu tượng cho Bot
const BotIcon = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
    AI
  </div>
);

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "Tôi muốn kiểm tra đơn hàng",
  "Thời gian giao hàng là bao lâu?",
  "Chính sách đổi trả như thế nào?",
  "Các phương thức thanh toán là gì?",
  "Sản phẩm có lượt xem nhiều nhất là gì?",
  "Sản phẩm rẻ nhất là gì?",
  "Sản phẩm đắt nhất là gì?",
  "Sản phẩm được yêu thích là gì?",
];

export default function ChatBox() {
  // Thêm tin nhắn chào mừng ban đầu
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Xin chào! Tôi là trợ lý ảo, tôi có thể giúp gì cho bạn?",
    },
  ]);
  const [input, setInput] = useState("");
  // Thêm state để quản lý trạng thái "đang gõ" của bot
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); // Thêm isTyping để scroll khi bot bắt đầu gõ

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Logic xử lý của bạn được giữ nguyên
  const handleBotReply = async (input: string): Promise<string> => {
    const lower = input.toLowerCase();

    if (lower.includes("đơn hàng")) {
      const orders = await getCurrentUserOrders();
      if (!orders.length) return "Bạn chưa có đơn hàng nào.";

      return orders
        .map(
          (order) =>
            `🧾 Đơn hàng #${order.id}\n📅 Ngày: ${new Date(
              order.createdAt
            ).toLocaleDateString()}\n💸 Tổng tiền: ${formatPrice(
              Number(order.price)
            )}\n📦 Trạng thái: ${order.status}`
        )
        .join("\n\n");
    }

    const res = await fetch("/api/products/stats");
    if (!res.ok)
      return "❌ Không thể lấy thông tin sản phẩm. Vui lòng thử lại sau.";
    const stats = await res.json();

    if (lower.includes("lượt xem")) {
      if (!stats?.mostViewedProduct)
        return "❌ Không tìm thấy sản phẩm có lượt xem nhiều nhất.";
      return `🔥 Sản phẩm có lượt xem nhiều nhất:\n🛍️ ${stats.mostViewedProduct.title}\n💰 Giá: ${formatPrice(
        Number(stats.mostViewedProduct.price)
      )}`;
    }

    if (lower.includes("rẻ nhất")) {
      if (!stats?.cheapestProduct)
        return "❌ Không tìm thấy sản phẩm rẻ nhất.";
      return `💰 Sản phẩm rẻ nhất:\n🛍️ ${stats.cheapestProduct.title}\n💸 Giá: ${formatPrice(
        Number(stats.cheapestProduct.price)
      )}`;
    }

    if (lower.includes("đắt nhất")) {
      if (!stats?.mostExpensiveProduct)
        return "❌ Không tìm thấy sản phẩm đắt nhất.";
      return `💎 Sản phẩm đắt nhất:\n🛍️ ${stats.mostExpensiveProduct.title}\n💸 Giá: ${formatPrice(
        Number(stats.mostExpensiveProduct.price)
      )}`;
    }

    if (lower.includes("yêu thích")) {
      if (!stats?.mostLikedProduct)
        return "❌ Không tìm thấy sản phẩm được yêu thích nhất.";
      return `❤️ Sản phẩm được yêu thích nhất:\n🛍️ ${stats.mostLikedProduct.title}\n💸 Giá: ${formatPrice(
        Number(stats.mostLikedProduct.price)
      )}`;
    }

    return getBotReply(input);
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = { role: "user", content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    
    // Đặt isTyping thành true để hiển thị hiệu ứng
    setIsTyping(true);

    const botReply = await handleBotReply(messageContent);
    const botMessage: Message = { role: "assistant", content: botReply };

    // Tắt isTyping và hiển thị tin nhắn của bot
    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
    setInput("");
  };

  const handleSuggestedClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    // Khung chính: bóng đổ nhẹ nhàng, gradient tinh tế hơn
    <div className="flex flex-col h-full max-h-[700px] rounded-2xl shadow-xl border border-gray-200/80 bg-slate-50 overflow-hidden">
      {/* Header cho Chatbox */}
      <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-gray-200/80 flex items-center gap-4">
        <BotIcon />
        <div>
          <h3 className="font-bold text-gray-800 text-base">Trợ lý AI</h3>
          <p className="text-xs text-green-500 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Đang hoạt động
          </p>
        </div>
      </div>

      {/* Khu vực tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && <BotIcon />}
            <div
              className={`px-4 py-2.5 max-w-[80%] text-sm rounded-2xl whitespace-pre-wrap shadow-sm transition-all duration-300 animate-fadeIn ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-lg"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-lg"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {/* Hiệu ứng "đang gõ" */}
        {isTyping && (
          <div className="flex items-end gap-3 animate-fadeIn">
            <BotIcon />
            <div className="flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-bl-lg shadow-sm">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Khu vực câu hỏi gợi ý */}
      <div className="px-4 pt-2 pb-3 border-t border-gray-200/80 bg-white/60 backdrop-blur-sm">
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 w-max animate-fadeIn">
            {suggestedQuestions.map((q, i) => (
                <button
                key={i}
                onClick={() => handleSuggestedClick(q)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 whitespace-nowrap hover:bg-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm"
                >
                {q}
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* Form nhập liệu */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-gray-200/80 p-4 bg-white"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow duration-200 text-sm placeholder-gray-500"
          placeholder="Nhập câu hỏi của bạn..."
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Gửi tin nhắn"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
}

// Hàm này bạn giữ nguyên
export function getBotReply(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("đơn hàng") || lower.includes("kiểm tra đơn")) {
    return "🛒 Bạn có thể kiểm tra đơn hàng tại mục 'Đơn hàng của tôi' hoặc nhấn vào nút bên dưới để xem chi tiết.";
  }

  if (
    lower.includes("giao hàng") ||
    lower.includes("bao lâu") ||
    lower.includes("mấy ngày")
  ) {
    return "🚚 Thời gian giao hàng thường từ 2-5 ngày làm việc tùy vào khu vực.";
  }

  if (
    lower.includes("đổi trả") ||
    lower.includes("trả hàng") ||
    lower.includes("đổi sản phẩm")
  ) {
    return "🔁 Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng. Vui lòng giữ nguyên tem, nhãn và hóa đơn.";
  }

  if (
    lower.includes("thanh toán") ||
    lower.includes("trả tiền") ||
    lower.includes("cách thanh toán")
  ) {
    return "💳 Chúng tôi hỗ trợ thanh toán qua Momo, thẻ ATM, chuyển khoản ngân hàng, và tiền mặt khi nhận hàng (COD).";
  }

  return "❓ Xin lỗi, mình chưa hiểu rõ. Bạn có thể chọn một câu hỏi gợi ý bên dưới hoặc nói rõ hơn nhé.";
}