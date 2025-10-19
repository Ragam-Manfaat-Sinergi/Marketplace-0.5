"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function ProductSlider() {
  // 👉 contoh data slider (nanti bisa ambil dari API Laravel)
  const sliders = [
    { id: 1, image: "/banner1.jpg", link: "#" },
    { id: 2, image: "/banner2.jpg", link: "#" },
    { id: 3, image: "/banner3.jpg", link: "#" },
  ];

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-sm">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-56 md:h-72"
      >
        {sliders.map((slide) => (
          <SwiperSlide key={slide.id}>
            <a href={slide.link}>
              <img
                src={slide.image}
                alt={`Banner ${slide.id}`}
                className="w-full h-56 md:h-72 object-cover"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
