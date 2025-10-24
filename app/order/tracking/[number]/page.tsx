"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Pusher from "pusher-js";
import Lottie from "lottie-react";

// 🎬 Import semua animasi
import paymentWait from "@/public/animations/Payment_verify_loader.json";
import paymentSuccess from "@/public/animations/payment_sucess.json";
import verifyWait from "@/public/animations/Clock_loop.json";
import printing from "@/public/animations/Man_printing_flex.json";
import delivery from "@/public/animations/Delivery_truck.json";
import done from "@/public/animations/asesoria.json";

const STATUS_FLOW = [
  { key: "pending", label: "Menunggu Pembayaran", icon: "💸", anim: paymentWait },
  { key: "awaiting_verification", label: "Menunggu Verifikasi", icon: "🕓", anim: verifyWait },
  { key: "paid", label: "Pembayaran Diterima", icon: "✅", anim: paymentSuccess },
  { key: "processing", label: "Sedang Diproduksi", icon: "⚙️", anim: printing },
  { key: "shipped", label: "Sedang Dikirim", icon: "🚚", anim: delivery },
  { key: "completed", label: "Selesai", icon: "🎉", anim: done },
  { key: "canceled", label: "Dibatalkan", icon: "❌", anim: null },
];

export default function TrackingPage() {
  const { number } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<number>(0);

  // 🧠 Ambil data order pertama kali
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/marketplace/orders/track/${number}`,
          { headers: { Accept: "application/json" } }
        );
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
          setStatus(data.data.status);

          // Estimasi 4 jam saat produksi
          if (data.data.status === "processing") {
            const end = new Date(data.data.updated_at).getTime() + 4 * 60 * 60 * 1000;
            setCountdown(Math.max(0, end - Date.now()));
          }
        }
      } catch (e) {
        console.error("❌ Gagal ambil data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [number]);

  // ⏱️ Countdown updater
  useEffect(() => {
    if (!countdown) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1000 ? prev - 1000 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // 🔁 Realtime update via Pusher
  useEffect(() => {
    if (!number) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
      wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST!,
      wsPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT!),
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
    });
    const channel = pusher.subscribe(`private-order.${number}`);
    channel.bind("order.status.updated", (data: any) => {
      console.log("📡 Status updated:", data);
      setStatus(data.status);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [number]);

  // 🕒 Format waktu countdown
  const formatCountdown = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // 📱 Share ke WhatsApp
  const handleShareWhatsApp = () => {
    const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/order/tracking/${number}`;
    const message = `Halo! 👋\n\nBerikut link untuk melacak pesanan kamu di Sidomulyo Printing:\n📦 Nomor Pesanan: *${number}*\n\nLacak di sini 👉 ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg animate-pulse">⏳ Memuat data...</p>
      </div>
    );

  if (!order)
    return (
      <div className="text-center py-20">
        <p className="text-red-600 font-semibold text-lg">❌ Pesanan tidak ditemukan.</p>
      </div>
    );

  const currentStatus = STATUS_FLOW.find((s) => s.key === status);

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📦 Tracking Pesanan</h1>
        <p className="text-gray-600">
          Nomor Pesanan:{" "}
          <span className="font-semibold text-green-600">{order.number || number}</span>
        </p>
      </div>

      {/* 🎬 Animasi Status */}
      <div className="bg-white shadow rounded-xl p-8 flex flex-col items-center border relative overflow-hidden transition-all duration-500">
        {currentStatus?.anim ? (
          <Lottie
            animationData={currentStatus.anim}
            loop
            className="w-56 h-56"
          />
        ) : (
          <div className="text-6xl">❌</div>
        )}

        <h2 className="text-xl font-semibold text-green-700 mt-4">
          {currentStatus?.label || status}
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          {status === "canceled"
            ? "Pesanan telah dibatalkan oleh admin atau sistem."
            : "Pesanan kamu sedang dalam tahap " + (currentStatus?.label || status)}
        </p>

        {/* ⏱️ Countdown (khusus produksi) */}
        {status === "processing" && countdown > 0 && (
          <div className="mt-4 bg-green-50 px-6 py-3 rounded-lg border border-green-200 shadow-sm">
            <p className="text-sm text-gray-700">Estimasi selesai dalam:</p>
            <p className="text-2xl font-mono font-bold text-green-700 mt-1">
              {formatCountdown(countdown)}
            </p>
          </div>
        )}
      </div>

      {/* 📋 Info & Item */}
      <div className="mt-10">
        <div className="bg-white border rounded-lg shadow-sm p-5">
          <h3 className="font-semibold text-lg text-gray-800 mb-3">🧾 Rincian Pesanan</h3>
          <p className="text-gray-700 text-sm">
            Status: <strong>{currentStatus?.label}</strong>
          </p>
          <p className="text-gray-700 text-sm">
            Total: <strong>Rp {order.total.toLocaleString("id-ID")}</strong>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Diperbarui: {new Date(order.updated_at).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-white border rounded-lg shadow-sm p-5 mt-5">
          <h3 className="font-semibold text-lg text-gray-800 mb-3">📦 Item Pesanan</h3>
          <ul className="divide-y">
            {order.items?.map((item: any) => (
              <li key={item.id} className="py-3 flex justify-between text-gray-700">
                <span>{item.name}</span>
                <span>
                  {item.qty}x — Rp {item.price.toLocaleString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 💬 Share WhatsApp */}
      <div className="mt-10 text-center">
        <button
          onClick={handleShareWhatsApp}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow transition"
        >
          💬 Bagikan Link Tracking via WhatsApp
        </button>
      </div>
    </div>
  );
}
