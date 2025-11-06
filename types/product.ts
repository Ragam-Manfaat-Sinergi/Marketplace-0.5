// types/product.ts

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  stock?: number;
  image?: string | null;
  image_url?: string | null;
  gallery?: string[];
  category_id?: number;
  category_name?: string;
  variants?: Variant[];
  specifications?: Record<string, any> | string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Variant {
  id: number;
  name: string;
  price: number;
}
