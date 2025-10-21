"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// 🧩 Tipe data
interface FooterColumnItem {
  title: string;
  link?: string;
}

interface UiSettings {
  footer_logo?: string;
  footer_qr?: string;
  footer_playstore?: string;
  footer_column_1?: { title: string; items: FooterColumnItem[] };
  footer_column_2?: { title: string; items: FooterColumnItem[] };
  footer_column_3?: { title: string; items: FooterColumnItem[] };
  footer_partners?: { image: string }[];
  footer_socials?: Record<string, string>;
  footer_text?: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<UiSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/marketplace/ui-settings`,
          { cache: "no-store" } // selalu ambil terbaru dari backend
        );

        if (!res.ok) throw new Error("Gagal memuat UI Settings");

        const json = await res.json();
        if (json.success) {
          setSettings(json.data);
        }
      } catch (error) {
        console.error("❌ Gagal memuat footer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <footer className="text-center py-8 text-gray-400 text-sm">
        Memuat footer...
      </footer>
    );
  }

  if (!settings) {
    return (
      <footer className="text-center py-8 text-gray-500 text-sm">
        Footer tidak tersedia.
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6 mt-12 text-gray-700 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
        {/* 🔹 Kolom 1 */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            {settings.footer_column_1?.title || "Sidomulyo Project"}
          </h3>
          <ul className="space-y-2">
            {settings.footer_column_1?.items?.map((item, idx) => (
              <li key={idx}>
                <a href={item.link || "#"} className="hover:text-sky-600 transition">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 🔹 Kolom 2 */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            {settings.footer_column_2?.title || "Beli"}
          </h3>
          <ul className="space-y-2">
            {settings.footer_column_2?.items?.map((item, idx) => (
              <li key={idx}>
                <a href={item.link || "#"} className="hover:text-sky-600 transition">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 🔹 Kolom 3 */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            {settings.footer_column_3?.title || "Bantuan & Panduan"}
          </h3>
          <ul className="space-y-2 mb-4">
            {settings.footer_column_3?.items?.map((item, idx) => (
              <li key={idx}>
                <a href={item.link || "#"} className="hover:text-sky-600 transition">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          {/* 🔗 Sosial Media */}
          <div className="flex gap-4 mt-2">
            {Object.entries(settings.footer_socials || {}).map(([platform, url]) =>
              url ? (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                >
                  <img
                    src={`/icons/${platform}.svg`}
                    alt={platform}
                    className="w-5 h-5 hover:scale-110 transition-transform"
                  />
                </a>
              ) : null
            )}
          </div>
        </div>

        {/* 🔹 Kolom Partner */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Partner & Client</h3>
          <div className="grid grid-cols-3 gap-2">
            {settings.footer_partners?.map((partner, idx) => (
              <Image
                key={idx}
                src={
                  partner.image.startsWith("http")
                    ? partner.image
                    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${partner.image}`
                }
                alt={`Partner ${idx}`}
                width={60}
                height={60}
                className="rounded-lg object-contain"
              />
            ))}
          </div>
        </div>

        {/* 🔹 Kolom Aplikasi */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Nikmati Keuntungan di Aplikasi
          </h3>
          <ul className="space-y-1 mb-3 text-sm text-gray-600">
            <li>🎁 Diskon 20% hanya di aplikasi</li>
            <li>🚚 Promo khusus aplikasi</li>
            <li>📦 Gratis ongkir</li>
          </ul>

          <div className="flex items-center gap-3">
            {settings.footer_qr && (
              <Image
                src={settings.footer_qr}
                alt="QR Code"
                width={80}
                height={80}
                className="rounded-md"
              />
            )}
            {settings.footer_playstore && (
              <a href={settings.footer_playstore} target="_blank" rel="noreferrer">
                <img
                  src="/icons/playstore.svg"
                  alt="Playstore"
                  className="w-32 hover:scale-105 transition"
                />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t mt-10 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Sidomulyo Marketplace.{" "}
        {settings.footer_text || "Semua hak dilindungi."}
      </div>
    </footer>
  );
}
