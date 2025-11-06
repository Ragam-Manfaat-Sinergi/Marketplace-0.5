"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Kamu harus login untuk melihat pesanan.");
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/marketplace/orders`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          // ✅ Ambil array dari data.data
          const orderArray = Array.isArray(data.data)
            ? data.data
            : data.data?.data || [];

          // ✅ Filter hanya yang SUDAH DIBAYAR, DIPROSES, DIKIRIM, SELESAI
          const filteredOrders = orderArray.filter((order: any) =>
            ["paid", "processing", "shipped", "completed"].includes(order.status)
          );

          setOrders(filteredOrders);
        } else {
          throw new Error(data.message || "Gagal memuat pesanan.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 text-center p-10 animate-pulse">
        ⏳ Memuat pesanan kamu...
      </p>
    );

  if (error)
    return <p className="text-red-500 text-center p-10">❌ {error}</p>;

  if (orders.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-gray-700">
          🚚 Belum ada pesanan yang sedang diproses
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Pesanan yang sudah dibayar akan muncul di sini untuk kamu lacak.
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        🚚 Pesanan Sedang Diproses / Dikirim
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow border p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                📦 {order.number}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                Status:{" "}
                <span
                  className={`font-medium ${
                    order.status === "completed"
                      ? "text-blue-600"
                      : order.status === "shipped"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status.replace("_", " ")}
                </span>
              </p>
              <p className="text-gray-600 text-sm mb-1">
                Total:{" "}
                <strong className="text-green-700">
                  Rp {order.total.toLocaleString("id-ID")}
                </strong>
              </p>
              <p className="text-gray-500 text-xs">
                Tanggal: {new Date(order.created_at).toLocaleString("id-ID")}
              </p>

              <div className="mt-3 border-t border-gray-100 pt-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Item Pesanan:
                </h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  {order.items?.map((item: any) => (
                    <li key={item.id}>
                      - {item.name} ({item.qty}x)
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 🎯 Tombol Aksi */}
            <div className="mt-6 flex justify-end">
              <Link
                href={`/order/tracking/${order.number}`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition"
              >
                🚚 Lacak Pesanan
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
