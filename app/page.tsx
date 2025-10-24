"use client";

import { useEffect, useState } from "react";
import ProductSlider from "@/components/ProductSlider";
import CategoryList from "@/components/CategoryList";
import Link from "next/link";
import { getProducts, Product } from "@/lib/api";
import MobileNav from "@/components/MobileNav";

/**
 * 🏠 Halaman Utama Marketplace
 * - Background putih bersih
 * - Produk terbaru dari API
 * - Desain elegan & transparan
 * - Kategori diambil dari backend (otomatis)
 */
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
        console.log("✅ Produk dari API:", data);
        setProducts(data);
      } catch (error) {
        console.error("❌ Gagal memuat produk:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white relative pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-10 space-y-10">
        {/* 🖼️ SLIDER BANNER */}
        <section>
          <ProductSlider />
        </section>

        {/* 🧭 KATEGORI PILIHAN */}
        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
            Kategori Pilihan
          </h2>
          <CategoryList />
        </section>

        {/* 🛍️ PRODUK TERBARU */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Produk Terbaru
            </h2>
            <Link
              href="/produk"
              className="text-sm text-green-600 hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-6">
              ⏳ Memuat produk...
            </p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">
              Belum ada produk tersedia.
            </p>
          )}
        </section>
      </div>

      {/* 🚀 Menu bawah hanya tampil di mobile */}
      <MobileNav />
    </div>
  );
}

/**
 * 🧊 Komponen Kartu Produk
 */
function ProductCard({ product }: { product: Product }) {
  const imageUrl =
    product.image_url ||
    (product.image
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image}`
      : "/no-image.png");

  return (
    <Link
      href={`/produk/${product.id}`}
      className="group block rounded-xl p-3 bg-white/70 backdrop-blur-md border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
    >
      {/* 🖼️ Gambar Produk */}
      <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-white/80">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 🏷️ Detail Produk */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-gray-800 group-hover:text-green-600 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-base font-semibold text-green-600">
          Rp {product.price?.toLocaleString("id-ID")}
        </p>
        <p className="text-xs text-gray-500">
          Stok: {product.stock > 0 ? product.stock : "Habis"}
        </p>
      </div>
    </Link>
  );
}
