// app/kategori/[slug]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/api";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export default function KategoriPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Ambil kategori by slug
        const cat = await getCategoryBySlug(slug);
        if (!cat) {
          setError("❌ Kategori tidak ditemukan.");
          return;
        }

        setCategory(cat);

        // Ambil produk dari kategori langsung (API endpoint baru)
        const productsData = await getProductsByCategory(slug);
        setProducts(productsData);
      } catch (err: any) {
        console.error("❌ Gagal memuat kategori atau produk:", err);
        setError("❌ Gagal memuat data kategori atau produk.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchData();
  }, [slug]);

  // ⏳ State loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">⏳ Memuat kategori...</p>
      </div>
    );
  }

  // ❌ Jika kategori tidak ditemukan / error
  if (error || !category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 mb-4">{error || "❌ Kategori tidak ditemukan."}</p>
        <Link href="/" className="text-green-600 hover:underline">
          ← Kembali ke beranda
        </Link>
      </div>
    );
  }

  // ✅ Jika data kategori & produk berhasil dimuat
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{category.name}</h1>

      {category.description && (
        <p className="text-gray-600 mb-8">{category.description}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/produk/${product.id}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <div className="relative w-full h-40 bg-gray-100">
                <Image
                  src={
                    product.image_url ||
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image}` ||
                    "/no-image.png"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h2 className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-green-600 font-bold text-sm mt-1">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            Belum ada produk di kategori ini.
          </p>
        )}
      </div>
    </div>
  );
}
