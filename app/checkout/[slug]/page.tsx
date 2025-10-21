"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const { slug } = useParams(); // slug = ID pesanan
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchOrder() {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("Kamu harus login terlebih dahulu.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/marketplace/orders/${slug}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.data);
        } else {
          setError(data.message || "Pesanan tidak ditemukan.");
        }
      } catch {
        setError("Gagal mengambil data pesanan.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [slug]);

  // 💳 Tombol bayar sekarang
  const handlePayment = async () => {
    if (!order) return;
    setPaying(true);
    setSuccess(null);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("Belum login.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/marketplace/orders/${order.id}/pay`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setOrder(data.data);
        setSuccess("✅ Pembayaran berhasil dikonfirmasi!");
      } else {
        throw new Error(data.message || "Gagal melakukan pembayaran.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat pembayaran.");
    } finally {
      setPaying(false);
    }
  };

  if (loading)
    return <p className="text-gray-500 text-center p-10">⏳ Memuat data checkout...</p>;

  if (error)
    return <p className="text-red-500 text-center p-10">❌ {error}</p>;

  if (!order)
    return <p className="text-red-500 text-center p-10">❌ Pesanan tidak ditemukan.</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-5">Checkout Pesanan</h1>

      <div className="border rounded-lg p-5 bg-white shadow-sm">
        <h2 className="font-semibold text-lg mb-2">
          Nomor Pesanan: {order.number}
        </h2>
        <p>Status: <strong>{order.status}</strong></p>
        <p className="text-green-600 font-semibold mt-3">
          Total: Rp {order.total.toLocaleString("id-ID")}
        </p>

        <div className="mt-4">
          <h3 className="font-semibold">Item Pesanan:</h3>
          <ul className="list-disc ml-6 mt-2">
            {order.items?.map((item: any) => (
              <li key={item.id}>
                {item.name} ({item.qty}x) — Rp{" "}
                {item.price.toLocaleString("id-ID")}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
        {order.status !== "paid" ? (
          <button
            onClick={handlePayment}
            disabled={paying}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {paying ? "Memproses..." : "💳 Bayar Sekarang"}
          </button>
        ) : (
          <p className="text-green-600 font-semibold">✅ Pesanan sudah dibayar</p>
        )}

        {success && <p className="text-green-600 mt-3">{success}</p>}
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>
    </div>
  );
}
