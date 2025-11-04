export function getBotReply(message: string): string {
  const lower = message.toLowerCase();

  // Tìm đơn hàng
  if (lower.includes("đơn hàng") || lower.includes("kiểm tra đơn")) {
    return "🛒 Bạn có thể kiểm tra đơn hàng tại mục 'Đơn hàng của tôi' hoặc nhấn vào nút bên dưới để xem chi tiết.";
  }

  // Thời gian giao hàng
  if (
    lower.includes("giao hàng") ||
    lower.includes("bao lâu") ||
    lower.includes("mấy ngày")
  ) {
    return "🚚 Thời gian giao hàng thường từ 2-5 ngày làm việc tùy vào khu vực.";
  }

  // Chính sách đổi trả
  if (
    lower.includes("đổi trả") ||
    lower.includes("trả hàng") ||
    lower.includes("đổi sản phẩm")
  ) {
    return "🔁 Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng. Vui lòng giữ nguyên tem, nhãn và hóa đơn.";
  }

  // Thanh toán
  if (
    lower.includes("thanh toán") ||
    lower.includes("trả tiền") ||
    lower.includes("cách thanh toán")
  ) {
    return "💳 Chúng tôi hỗ trợ thanh toán qua Momo, thẻ ATM, chuyển khoản ngân hàng, và tiền mặt khi nhận hàng (COD).";
  }

  // Trường hợp không hiểu rõ
  return "❓ Xin lỗi, mình chưa hiểu rõ. Bạn có thể chọn một câu hỏi gợi ý bên dưới hoặc nói rõ hơn nhé.";
}
