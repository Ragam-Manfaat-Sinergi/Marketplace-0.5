"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon_url: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/categories`, {
          cache: "no-store",
        });
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data);
        }
      } catch (err) {
        console.error("❌ Gagal memuat kategori:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  if (loading) {
    return <div className="text-center py-6 text-gray-500">⏳ Memuat kategori...</div>;
  }

  if (!categories.length) {
    return <div className="text-center py-6 text-gray-500">Belum ada kategori tersedia.</div>;
  }

  return (
    <div className="relative group">
      {/* 🔹 Tombol Kiri */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white shadow-md border rounded-full hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100"
        aria-label="Geser kiri"
      >
        ‹
      </button>

      {/* 🔹 Scroll Area */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 pb-3 scrollbar-hidden group-hover:scrollbar-visible"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/kategori/${category.slug}`}
            className="flex-none snap-start w-24 sm:w-28 md:w-32 text-center group/item"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm group-hover:shadow-md overflow-hidden transition-all duration-300">
              <Image
                src={category.icon_url || "/images/default-category.png"}
                alt={category.name}
                width={50}
                height={50}
                className="object-contain group-hover/item:scale-110 transition-transform duration-300"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700 group-hover/item:text-blue-600 truncate">
              {category.name}
            </p>
          </Link>
        ))}
      </div>

      {/* 🔹 Tombol Kanan */}
      <button
        onClick={scrollRight}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white shadow-md border rounded-full hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100"
        aria-label="Geser kanan"
      >
        ›
      </button>
    </div>
  );
}
