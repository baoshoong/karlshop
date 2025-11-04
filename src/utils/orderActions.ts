// ✅ Đây là hàm bạn gọi được trong ChatBox.tsx (client component)
export async function getCurrentUserOrders(): Promise<any[]> {
  const res = await fetch("/api/user-orders", {
    method: "GET",
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.orders || [];
}
