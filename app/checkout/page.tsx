"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    async function fetchOrder() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/orders/${id}`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error("❌ Gagal ambil order:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

  if (loading) return <p>⏳ Memuat data checkout...</p>;
  if (!order) return <p>❌ Order tidak ditemukan</p>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Checkout Pesanan</h1>

      <div className="border p-4 rounded-lg bg-white">
        <h2 className="font-semibold text-lg">Nomor Pesanan: {order.number}</h2>
        <p>Status: <strong>{order.status}</strong></p>
        <p>Total: <strong>Rp {order.total.toLocaleString("id-ID")}</strong></p>

        <h3 className="mt-4 font-semibold">Item Pesanan:</h3>
        <ul className="list-disc ml-6">
          {order.items.map((item: any) => (
            <li key={item.id}>
              {item.name} ({item.qty}x) — Rp {item.price.toLocaleString("id-ID")}
            </li>
          ))}
        </ul>
      </div>

      <button className="mt-6 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700">
        Bayar Sekarang
      </button>
    </div>
  );
}
