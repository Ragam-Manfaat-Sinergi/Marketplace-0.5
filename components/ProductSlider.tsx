"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Slider {
  id: number;
  title?: string;
  link?: string | null;
  image_url?: string | null;
  order?: number;
}

export default function ProductSlider() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 Fetch slider dari backend
  useEffect(() => {
    async function fetchSliders() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/slider`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const validSliders = data.data
            .filter((s: Slider) => s.image_url && s.image_url.trim() !== "")
            .sort((a: Slider, b: Slider) => (a.order ?? 0) - (b.order ?? 0));

          setSliders(validSliders);
        }
      } catch (error) {
        console.error("❌ Gagal memuat slider:", error);
      }
    }

    fetchSliders();
  }, []);

  // 🔹 Auto slide tiap 5 detik
  useEffect(() => {
    if (sliders.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders]);

  // 🔸 Fallback jika belum ada slider
  if (sliders.length === 0) {
    return (
      <div className="w-full h-[180px] sm:h-[300px] md:h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 text-sm">Belum ada slider tersedia.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[180px] sm:h-[300px] md:h-[400px] lg:h-[400px] xl:h-[400px] overflow-hidden rounded-lg shadow-lg">
      {sliders.map((slider, index) => {
        // ✅ fallback jika image kosong
        const imageSrc =
          slider.image_url && slider.image_url.trim() !== ""
            ? slider.image_url
            : "/images/default-banner.jpg";

        return (
          <div
            key={slider.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <a
              href={slider.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <Image
                src={imageSrc}
                alt={slider.title || `Slider ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover w-full h-full"
                sizes="100vw"
              />
            </a>
          </div>
        );
      })}

      {/* 🔹 Tombol navigasi kiri-kanan */}
      <button
        onClick={() =>
          setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow transition"
        aria-label="Previous Slide"
      >
        ❮
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % sliders.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow transition"
        aria-label="Next Slide"
      >
        ❯
      </button>

      {/* 🔹 Titik indikator (pagination dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {sliders.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              index === currentIndex
                ? "bg-blue-600"
                : "bg-white border border-gray-400"
            }`}
          ></div>
        ))}
      </div>

      {/* 🔹 Judul slider (opsional, tampil di bawah) */}
      {sliders[currentIndex]?.title && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1 rounded-full text-sm">
          {sliders[currentIndex].title}
        </div>
      )}
    </div>
  );
}
