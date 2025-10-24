"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { slug } = useParams(); // slug = order ID
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 🔄 Ambil data pesanan
  useEffect(() => {
    if (!slug) return;

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Kamu harus login terlebih dahulu.");
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/marketplace/orders/${slug}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await res.text();

        try {
          const data = JSON.parse(text);
          if (res.ok && data.success) {
            setOrder(data.data);
          } else {
            setError(data.message || "Pesanan tidak ditemukan.");
          }
        } catch {
          console.error("🚨 Respons bukan JSON:", text);
          setError("Server mengirim respons tidak valid.");
        }
      } catch (err: any) {
        console.error("🚨 Gagal memuat pesanan:", err);
        setError("Terjadi kesalahan saat mengambil data pesanan.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [slug]);

  // 📤 Upload bukti transfer
  const handleUploadProof = async () => {
    if (!proofFile) {
      setError("Pilih file bukti transfer terlebih dahulu.");
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Kamu harus login terlebih dahulu.");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("payment_proof", proofFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/marketplace/orders/${order.id}/upload-proof`,
        {
          method: "POST",
          headers: {
            Accept: "application/json", // ✅ Laravel akan kirim JSON
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        if (res.ok && data.success) {
          setOrder(data.data);
          setSuccess("✅ Bukti transfer berhasil diupload! Tunggu verifikasi admin.");
        } else {
          throw new Error(data.message || "Gagal upload bukti pembayaran.");
        }
      } catch {
        console.error("🚨 Respons bukan JSON:", text);
        setError("Server mengirim respons tidak valid saat upload.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
    }
  };

  // 🕓 Tampilan loading
  if (loading)
    return (
      <p className="text-gray-500 text-center p-10">⏳ Memuat data checkout...</p>
    );

  // ❌ Jika error
  if (error)
    return (
      <p className="text-red-500 text-center p-10">❌ {error}</p>
    );

  // ❌ Jika order tidak ditemukan
  if (!order)
    return (
      <p className="text-red-500 text-center p-10">❌ Pesanan tidak ditemukan.</p>
    );

  // ✅ Tampilan utama
  const isPaid =
    ["paid", "processing", "shipped", "completed"].includes(order.status);

  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-5">Checkout Pesanan</h1>

      <div className="border rounded-lg p-5 bg-white shadow-sm">
        <h2 className="font-semibold text-lg mb-2">
          Nomor Pesanan: {order.number}
        </h2>
        <p>
          Status:{" "}
          <strong
            className={`capitalize ${
              isPaid ? "text-green-700" : "text-yellow-700"
            }`}
          >
            {order.status.replace("_", " ")}
          </strong>
        </p>
        <p className="text-green-600 font-semibold mt-3">
          Total: Rp {Number(order.total).toLocaleString("id-ID")}
        </p>

        {/* 💳 Rekening Pembayaran */}
        <div className="mt-4">
          <h3 className="font-semibold">Rekening Pembayaran:</h3>
          <div className="bg-gray-50 border rounded p-4 mt-2 text-sm text-gray-800">
            <p><strong>🏦 Bank BCA</strong></p>
            <p>No. Rekening: <strong>1234567890</strong></p>
            <p>Atas Nama: <strong>CV. Sidomulyo Printing</strong></p>
            <p className="text-xs text-gray-500 mt-2">
              Setelah melakukan transfer, silakan upload bukti pembayaran di bawah.
            </p>
          </div>
        </div>

        {/* 📤 Upload Bukti */}
        {order.status === "pending" || order.status === "awaiting_verification" ? (
          <div className="mt-6">
            <label className="block font-medium text-gray-700 mb-2">
              Upload Bukti Transfer:
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={handleUploadProof}
              disabled={uploading}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {uploading ? "Mengupload..." : "📤 Kirim Bukti Transfer"}
            </button>
          </div>
        ) : (
          <div className="mt-6 text-green-700 font-medium">
            ✅ Bukti pembayaran sudah dikirim atau diverifikasi.
          </div>
        )}

        {/* 📎 Bukti sudah diupload */}
        {order.payment_proof && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              📎 Bukti yang diupload:
              <a
                href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${order.payment_proof}`}
                target="_blank"
                className="text-blue-600 hover:underline ml-2"
              >
                Lihat Bukti
              </a>
            </p>
          </div>
        )}

        {/* 🚚 Tombol Tracking */}
        {isPaid && (
          <div className="mt-8 text-right">
            <Link
              href={`/order/tracking/${order.number}`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-sm text-sm font-medium transition"
            >
              🚚 Lacak Pesanan
            </Link>
          </div>
        )}

        {success && <p className="text-green-600 mt-4">{success}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
}
