// types/category.ts

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}
