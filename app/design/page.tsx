// app/design/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";

interface SavedDesign {
  id: number;
  design_name: string;
  preview_url: string;
  design_url: string;
}

declare global {
  interface Window {
    Canva?: any;
  }
}

export default function DesignIndexPage() {
  const router = useRouter();
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const token = localStorage.getItem("auth_token") || "";
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/designs`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const json = await res.json();
          // aman-aman: bisa data langsung array atau objek dengan properti designs
          const designs =
            Array.isArray(json.data)
              ? json.data
              : Array.isArray(json.data?.designs)
              ? json.data.designs
              : [];
          setSavedDesigns(designs);
        } else {
          console.warn("Gagal load desain tersimpan:", res.status, res.statusText);
          setSavedDesigns([]);
        }
      } catch (err) {
        console.error("Error fetch saved designs:", err);
        setSavedDesigns([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, [router]);

  const handleNewDesign = async () => {
    if (!window.Canva || !window.Canva.DesignButton) {
      alert("❌ Canva SDK belum siap!");
      return;
    }

    const appId = process.env.NEXT_PUBLIC_CANVA_APP_ID!;
    try {
      const api = await window.Canva.DesignButton.initialize({
        apiKey: appId,
      });
      const design = await api.createDesign({
        design: {
          type: "Poster",   // sesuaikan tipe sesuai kebutuhan Anda
        },
      });
      console.log("🎨 Desain selesai:", design);

      // Simpan ke backend
      const token = localStorage.getItem("auth_token") || "";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/designs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          design_name: design.designTitle,
          preview_url: design.previewUrl,
          design_url: design.designUrl,
        }),
      });
      if (!res.ok) {
        throw new Error("Gagal menyimpan desain ke server.");
      }
      alert("🎉 Desain berhasil disimpan!");
      // reload daftar atau navigasi ulang
      router.replace(router.asPath);
    } catch (err: any) {
      console.error("❌ Error handleNewDesign:", err);
      alert("Gagal memproses desain: " + (err.message || err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Script src="https://sdk.canva.com/designbutton/v2/api.js" strategy="afterInteractive" />
      <h1 className="text-3xl font-bold mb-6">🎨 Buat atau Pilih Desain</h1>

      <button
        onClick={handleNewDesign}
        className="mb-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        🖌️ Buat Desain Baru
      </button>

      <h2 className="text-2xl font-semibold mb-4">Desain Tersimpan</h2>

      {loading ? (
        <p>⏳ Memuat desain…</p>
      ) : savedDesigns.length === 0 ? (
        <p>Belum ada desain tersimpan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedDesigns.map((d) => (
            <div key={d.id} className="border rounded-lg p-3 shadow-sm">
              <img
                src={d.preview_url}
                alt={d.design_name}
                className="w-full h-auto mb-2 rounded"
              />
              <h3 className="font-medium text-lg mb-2">{d.design_name}</h3>
              <div className="flex gap-2">
                <Link
                  href={`/produk/select?designId=${d.id}`}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Gunakan untuk Produk
                </Link>
                <a
                  href={d.design_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                >
                  Lihat di Canva
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
