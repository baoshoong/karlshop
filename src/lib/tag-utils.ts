// // src/lib/tag-utils.ts

// import { prisma } from "@/lib/prisma";

// export type ChatMessage = {
//   role: "user" | "assistant" | "system";
//   content: string;
// };

// // Tự động nhận tag từ nội dung
// export function detectTagFromMessage(message: string): string | null {
//   if (message.toLowerCase().includes("đơn hàng")) return "order";
//   if (message.toLowerCase().includes("sản phẩm")) return "product";
//   return null;
// }

// // Sinh message hệ thống theo tag
// export async function generateContextMessage(tag: string | null, message: string): Promise<ChatMessage> {
//   switch (tag) {
//     case "order":
//       const recentOrders = await prisma.order.findMany({
//         take: 3,
//         orderBy: { createdAt: "desc" },
//       });

//       const orderSummary = recentOrders.map(
//         (o) => `• Đơn #${o.id} - Trạng thái: ${o.status} - Tổng tiền: ${o.price} VND`
//       ).join("\n");

//       return {
//         role: "system",
//         content: `Bạn là trợ lý hỗ trợ đơn hàng. Đây là các đơn hàng gần đây:\n${orderSummary}`,
//       };

//     case "product":
//       const products = await prisma.product.findMany({
//         take: 3,
//         orderBy: { createdAt: "desc" },
//       });

//       const productSummary = products.map(
//         (p) => `• ${p.title} - ${p.price} VND - ${p.desc}`
//       ).join("\n");

//       return {
//         role: "system",
//         content: `Bạn là trợ lý sản phẩm. Đây là các sản phẩm mới:\n${productSummary}`,
//       };

//     default:
//       return {
//         role: "system",
//         content: "Bạn là một trợ lý AI hỗ trợ khách hàng về đơn hàng, sản phẩm và dịch vụ.",
//       };
//   }
// }
