"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react"; // icon chat
import ChatBox from "./ChatBox";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Nút mở/đóng chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white p-3 rounded-full shadow-lg hover:scale-105 transition"
        aria-label="Mở Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Hộp chat hiển thị nếu isOpen */}
      {isOpen && (
        <div className="mt-3 w-[350px] max-h-[500px] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <ChatBox />
        </div>
      )}
    </div>
  );
}
