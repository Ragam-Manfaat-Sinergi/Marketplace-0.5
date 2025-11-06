"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { getProductById } from "@/lib/api";
import type { Product } from "@/types/product";

interface Variant {
  id: number;
  name: string;
  price: number;
}

export default function ProdukDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params?.id || params?.slug);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // data pesanan
  const [quantity, setQuantity] = useState(1);
  const [length, setLength] = useState(1);
  const [width, setWidth] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Variant[]>([]);
  const [activeTab, setActiveTab] = useState<"detail" | "spec" | "info">("detail");

  // upload desain & catatan
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designError, setDesignError] = useState<string | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);

  // auth & status kirim
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // cek token login
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    setIsLoggedIn(!!token);
  }, []);

  // ambil data produk
  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error("❌ gagal memuat produk:", error);
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchProduct();
  }, [productId]);

  // upload file desain
  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setDesignError("❌ format file tidak didukung. gunakan JPG, PNG, atau PDF.");
      setDesignFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setDesignError("❌ ukuran file maksimal 10 MB.");
      setDesignFile(null);
      return;
    }

    setDesignError(null);
    setDesignFile(file);
  };

  // validasi catatan
  const handleOrderNoteChange = (value: string) => {
    if (value.length > 500) {
      setNoteError("keterangan maksimal 500 karakter.");
    } else {
      setNoteError(null);
    }
    setOrderNote(value);
  };

  // pilih varian
  const toggleVariant = (variant: Variant) => {
    setSelectedVariants((prev) =>
      prev.find((v) => v.id === variant.id)
        ? prev.filter((v) => v.id !== variant.id)
        : [...prev, variant]
    );
  };

  const basePrice = product?.price || 0;
  const area = Math.max(length, 0) * Math.max(width, 0);
  const variantTotal = selectedVariants.reduce((sum, v) => sum + v.price, 0);
  const totalPrice = basePrice * area * quantity + variantTotal;

  /** kirim pesanan ke backend */
  const handleOrderSubmit = async (directBuy: boolean) => {
    if (!product) return;
    if (noteError || designError) return;

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("product_id", String(product.id));
      formData.append("quantity", String(quantity));
      formData.append("length", String(length));
      formData.append("width", String(width));
      formData.append("variants", JSON.stringify(selectedVariants));
      formData.append("order_note", orderNote);
      if (designFile) formData.append("design_file", designFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/marketplace/orders`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          credentials: "include",
          mode: "cors",
        }
      );

      if (!response.ok) {
        const text = await response.text();
        let msg = "gagal mengirim pesanan ke server.";
        try {
          const j = JSON.parse(text);
          msg = j.message || Object.values(j.errors ?? {}).flat().join(", ");
        } catch {}
        throw new Error(msg);
      }

      const result = await response.json();
      if (!result.success) throw new Error(result.message || "gagal membuat pesanan.");

      setSuccessMessage("✅ pesanan berhasil dikirim!");
      if (directBuy && result.data?.order?.id) {
        router.push(`/checkout/${result.data.order.id}`);
      }
    } catch (err: any) {
      console.error("🚨 gagal kirim pesanan:", err);
      setErrorMessage(err.message || "terjadi kesalahan saat mengirim pesanan.");
    } finally {
      setSubmitting(false);
    }
  };

  // loading / not found
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">⏳ memuat detail produk...</p>
      </div>
    );

  if (!product)
    return ( 
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white">
        <p className="text-gray-500 mb-4">❌ produk tidak ditemukan.</p>
        <Link href="/" className="text-green-600 hover:underline">
          ← kembali ke daftar produk
        </Link>
      </div>
    );

  // gambar utama & gallery
  const mainImage =
    (product as any).image_url ||
    (product.image
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image}`
      : "/no-image.png");

  const galleryImages =
    (product as any).gallery?.length > 0
      ? (product as any).gallery
      : [mainImage];

  const specifications =
    typeof (product as any).specifications === "string"
      ? (product as any).specifications
      : JSON.stringify((product as any).specifications ?? {}, null, 2);

  // ================================================= UI =================================================
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* gambar produk */}
        <div className="md:col-span-1 space-y-3">
          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <img
              id="mainImage"
              src={mainImage}
              alt={product.name}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {galleryImages.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className="w-16 h-16 object-cover rounded-md border border-gray-200 hover:border-green-500 cursor-pointer"
                onClick={() => {
                  const main = document.querySelector<HTMLImageElement>("#mainImage");
                  if (main) main.src = img;
                }}
              />
            ))}
          </div>
        </div>

        {/* detail produk */}
        <div className="md:col-span-1 space-y-5">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          <p className="text-lg text-gray-700">Harga per meter:</p>
          <p className="text-3xl font-semibold text-green-600">
            Rp {basePrice.toLocaleString("id-ID")}
          </p>

          <p className="text-sm text-gray-500">
            ⭐ 5 (277 rating) | Terjual <strong>500+</strong>
          </p>

          <div className="border-t border-gray-200 my-3"></div>

          {/* ukuran */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Ukuran (meter)</label>
            <div className="flex gap-3 mt-1">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                placeholder="Panjang"
                className="w-1/2 border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                placeholder="Lebar"
                className="w-1/2 border rounded-lg px-3 py-2"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total luas: {area.toFixed(2)} m²
            </p>
          </div>

          {/* varian */}
          {(product as any).variants?.length > 0 && (
            <div className="mt-4">
              <label className="text-sm text-gray-600 font-medium">
                Pilih Tambahan Varian:
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(product as any).variants.map((variant: Variant) => {
                  const isActive = selectedVariants.some((v) => v.id === variant.id);
                  return (
                    <button
                      key={variant.id}
                      onClick={() => toggleVariant(variant)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                        isActive
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {variant.name} (+Rp {variant.price.toLocaleString("id-ID")})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* upload desain */}
          <div className="mt-5">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Upload Desain (opsional)
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleDesignUpload}
              className="w-full text-sm text-gray-800"
            />
            {designError && <p className="text-red-600 text-xs mt-1">{designError}</p>}
            {designFile && (
              <p className="text-green-600 text-xs mt-1">
                ✅ {designFile.name} ({(designFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* keterangan */}
          <div className="mt-5">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Keterangan Pemesanan (opsional)
            </label>
            <textarea
              rows={3}
              value={orderNote}
              onChange={(e) => handleOrderNoteChange(e.target.value)}
              placeholder="Contoh: tolong buat tanpa border, potong sisi kanan 1 cm..."
              className="w-full border rounded-lg px-3 py-2 text-gray-800"
            />
            <p className="text-xs text-gray-500 mt-1">{orderNote.length}/500 karakter</p>
            {noteError && <p className="text-red-600 text-xs mt-1">{noteError}</p>}
          </div>

          <div className="border-t border-gray-200 my-3"></div>

          <p className="text-xl font-semibold text-green-600">
            Total: Rp {totalPrice.toLocaleString("id-ID")}
          </p>
        </div>

        {/* pembelian */}
        <div className="md:col-span-1 bg-white/80 backdrop-blur-md border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-3">Atur jumlah & pembelian</h3>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded border border-gray-300 text-lg flex items-center justify-center hover:bg-gray-100"
            >
              -
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded border border-gray-300 text-lg flex items-center justify-center hover:bg-gray-100"
            >
              +
            </button>
          </div>

          <p className="text-gray-500 text-sm mb-4">
            Subtotal:
            <span className="text-lg font-semibold text-green-600 ml-2">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </p>

          <button
            onClick={() => handleOrderSubmit(false)}
            disabled={submitting}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-2 disabled:bg-gray-400"
          >
            {submitting ? "Memproses..." : "+ Keranjang"}
          </button>

          <button
            onClick={() => handleOrderSubmit(true)}
            disabled={submitting}
            className="w-full border border-green-600 text-green-600 py-2 rounded hover:bg-green-50 disabled:opacity-50"
          >
            {submitting ? "Memproses..." : "Beli Langsung"}
          </button>

          {successMessage && <p className="text-green-600 text-sm mt-3">{successMessage}</p>}
          {errorMessage && <p className="text-red-600 text-sm mt-3">{errorMessage}</p>}
        </div>

        {/* tab detail / spec / info */}
        <div className="md:col-span-3 mt-12 bg-white/70 backdrop-blur-md border border-gray-100 rounded-xl p-6 shadow-sm">
          <div className="flex gap-6 border-b mb-4">
            {[
              { key: "detail", label: "Detail" },
              { key: "spec", label: "Spesifikasi" },
              { key: "info", label: "Info Penting" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-2 font-medium ${
                  activeTab === tab.key
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-gray-700 mt-4">
            {activeTab === "detail" && (
              <div>
                <p className="mb-2">
                  Kondisi: <strong>Baru</strong>
                </p>
                <p>
                  Min. Pemesanan: <strong>1 Buah</strong>
                </p>
                <p className="mt-3 whitespace-pre-line">
                  {product.description || "tidak ada deskripsi produk."}
                </p>
              </div>
            )}

            {activeTab === "spec" && (
              <div>
                <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                  {specifications || "spesifikasi belum tersedia."}
                </pre>
              </div>
            )}

            {activeTab === "info" && (
              <div>
                <p>
                  informasi penting terkait pengiriman, garansi, atau kebijakan toko
                  akan ditampilkan di sini.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-block text-green-600 hover:underline">
              ← kembali ke produk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
