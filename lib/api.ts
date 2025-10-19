// 🌐 Konfigurasi URL API dan Backend
export const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

// 🧱 Tipe Data
export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  slug?: string;
  price: number;
  stock: number;
  image: string | null;
  image_url?: string | null; // dari backend
  imageUrl?: string | null;  // versi frontend
  description?: string | null;
  active: boolean;
  category?: Category | null;
}

/**
 * 📦 Ambil semua produk (GET /marketplace/products)
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/marketplace/products`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Gagal memuat produk:", res.status, res.statusText);
      throw new Error("Gagal memuat produk");
    }

    const json = await res.json();

    // Handle dua kemungkinan bentuk response
    const products = Array.isArray(json.data)
      ? json.data
      : json.data?.data || [];

    return products.map((p: any) => ({
      ...p,
      imageUrl: p.image_url || (p.image ? `${BACKEND_URL}/${p.image}` : null),
    }));
  } catch (error: any) {
    console.error("❌ Error getProducts:", error.message || error);
    return [];
  }
}

/**
 * 🧩 Ambil detail produk by ID (GET /marketplace/products/{id})
 */
export async function getProductById(id: number): Promise<Product> {
  try {
    const res = await fetch(`${API_URL}/marketplace/products/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Gagal fetch produk:", res.status, res.statusText);
      throw new Error(`Gagal mengambil produk ID ${id}`);
    }

    const json = await res.json();

    if (!json.success || !json.data) {
      throw new Error("Produk tidak ditemukan di server");
    }

    const p = json.data;

    return {
      ...p,
      imageUrl: p.image_url || (p.image ? `${BACKEND_URL}/${p.image}` : null),
    };
  } catch (error: any) {
    console.error("❌ Error getProductById:", error.message || error);
    throw error;
  }
}
