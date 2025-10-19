import Link from "next/link";
import { Product } from "@/lib/api";

interface Props {
  product: Product;
  showStock?: boolean;
}

export default function ProductCard({ product, showStock = true }: Props) {
  // ✅ Format harga jadi Rp 10.000
  const price =
    product.price != null
      ? product.price.toLocaleString("id-ID", { minimumFractionDigits: 0 })
      : "0";

  // ✅ Gambar fallback
  const imageSrc = product.image_url || "/no-image.png";

  return (
    <div
      className={`bg-white/90 dark:bg-gray-800 shadow-md rounded-lg p-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-100 dark:border-gray-700 ${
        !product.active ? "opacity-70" : ""
      }`}
    >
      {/* ✅ Link ke halaman produk */}
      <Link href={`/produk/${product.id}`} className="block">
        <div className="cursor-pointer">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-44 object-cover rounded-md transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <h3 className="mt-2 text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {product.name}
          </h3>
        </div>
      </Link>

      {/* 💰 Harga */}
      <p className="text-green-600 dark:text-green-400 font-semibold text-sm sm:text-base mt-1">
        Rp {price}
      </p>

      {/* 📦 Stok */}
      {showStock && (
        <p
          className={`text-xs mt-1 ${
            product.stock > 0 ? "text-gray-500" : "text-red-500"
          }`}
        >
          {product.stock > 0 ? `Stok: ${product.stock}` : "Stok Habis"}
        </p>
      )}

      {/* ⚠️ Status Produk Tidak Aktif */}
      {!product.active && (
        <p className="text-xs text-yellow-500 font-medium mt-1">(Tidak aktif)</p>
      )}
    </div>
  );
}
