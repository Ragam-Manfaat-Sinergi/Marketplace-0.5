"use client";

import { useEffect, useState } from "react";

export default function ResellerPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://192.168.1.100:8000/api/marketplace/reseller/products", {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-10 text-center">Memuat produk reseller...</div>;

  // ✅ Fungsi untuk format Rupiah tanpa desimal dan tanpa spasi
  const formatRupiah = (value: number) => {
    return (
      "Rp" +
      new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    );
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">🛍️ Produk Reseller</h1>

      {products.length === 0 ? (
        <p>Tidak ada produk reseller tersedia.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg shadow p-4">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                  Tidak ada gambar
                </div>
              )}
              <h3 className="font-semibold mt-2">{product.name}</h3>
              {/* ✅ Format harga tanpa spasi dan tanpa desimal */}
              <p className="text-blue-600 font-bold">
                {formatRupiah(product.price_reseller)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
