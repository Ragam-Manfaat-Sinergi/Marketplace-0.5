"use client";

import { useEffect, useState } from "react";
import { getProducts, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
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
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        🛍️ Semua Produk Marketplace
      </h1>

      {loading ? (
        <p className="text-gray-500">Memuat produk...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Belum ada produk.</p>
      )}
    </div>
  );
}
