// 🌐 Konfigurasi URL API dan Backend
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.100:8000/api/marketplace";
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.1.100:8000";

// 🧱 Tipe Data
export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  icon?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug?: string;
  price: number;
  stock: number;
  image: string | null;
  image_url?: string | null; // backend field
  imageUrl?: string | null;  // frontend alias
  description?: string | null;
  active: boolean;
  category?: Category | null;
  category_id?: number;
  variants?: Array<{ id: number; name: string; price: number }>;
  specifications?: Record<string, any> | string | null;
  created_at?: string;
  updated_at?: string;
}

/* ============================================================
   🏷️ KATEGORI
============================================================ */

/**
 * 📦 Ambil semua kategori (GET /categories)
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Gagal memuat kategori:", res.status, res.statusText);
      throw new Error("Gagal memuat kategori");
    }

    const json = await res.json();
    const categories = Array.isArray(json.data)
      ? json.data
      : json.data?.data || [];

    return categories.map((c: any) => ({
      ...c,
      image_url: c.image_url || (c.image ? `${BACKEND_URL}/${c.image}` : null),
    }));
  } catch (error: any) {
    console.error("❌ Error getCategories:", error.message || error);
    return [];
  }
}

/**
 * 🔍 Ambil kategori berdasarkan slug (GET /categories/{slug}/products)
 * (karena backend tidak punya endpoint kategori tunggal)
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}/products`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Gagal memuat kategori:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json.category || null;
  } catch (error: any) {
    console.error("❌ Error getCategoryBySlug:", error.message || error);
    return null;
  }
}

/* ============================================================
   🛍️ PRODUK
============================================================ */

/**
 * 📦 Ambil semua produk (GET /products)
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Gagal memuat produk:", res.status, res.statusText);
      throw new Error("Gagal memuat produk");
    }

    const json = await res.json();
    const products = Array.isArray(json.data)
      ? json.data
      : json.data?.data || [];

    return products.map((p: any) => ({
      ...p,
      image_url: p.image_url || (p.image ? `${BACKEND_URL}/${p.image}` : null),
    }));
  } catch (error: any) {
    console.error("❌ Error getProducts:", error.message || error);
    return [];
  }
}

/**
 * 🧩 Ambil detail produk by ID (GET /products/{id})
 */
export async function getProductById(id: number): Promise<Product> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Gagal fetch produk:", res.status, res.statusText);
      throw new Error(`Gagal mengambil produk ID ${id}`);
    }

    const json = await res.json();
    const p = json.data;

    return {
      ...p,
      image_url: p.image_url || (p.image ? `${BACKEND_URL}/${p.image}` : null),
    };
  } catch (error: any) {
    console.error("❌ Error getProductById:", error.message || error);
    throw error;
  }
}

/**
 * 🧩 Ambil semua produk berdasarkan kategori slug
 * (GET /categories/{slug}/products)
 */
export async function getProductsByCategory(slug: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}/products`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Gagal memuat produk kategori:", res.status, res.statusText);
      throw new Error("Gagal memuat produk kategori");
    }

    const json = await res.json();
    const products = json.data?.data || [];

    return products.map((p: any) => ({
      ...p,
      image_url: p.image_url || (p.image ? `${BACKEND_URL}/${p.image}` : null),
    }));
  } catch (error: any) {
    console.error("❌ Error getProductsByCategory:", error.message || error);
    return [];
  }
}
