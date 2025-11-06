"use client";

import { useEffect } from "react";
import Script from "next/script";

interface CanvaDesignButtonProps {
  productId?: number;
  userId: number;
  token: string;
}

export default function CanvaDesignButton({ productId, userId, token }: CanvaDesignButtonProps) {
  useEffect(() => {
    // pastikan SDK terload
    if (!window.Canva) {
      console.log("🟡 Menunggu Canva SDK...");
    }
  }, []);

  const handleDesign = () => {
    if (!window.Canva) {
      alert("❌ Canva belum siap!");
      return;
    }

    const appId = process.env.NEXT_PUBLIC_CANVA_APP_ID!;
    const canva = new window.Canva.DesignButton({
      apiKey: appId,
      designType: "poster", // kamu bisa ganti ke jenis lain: business_card, flyer, dsb
      onDesignOpen: () => console.log("🎨 Canva Editor dibuka"),
      onDesignPublish: async (design: any) => {
        console.log("✅ Desain berhasil dibuat:", design);

        // Simpan ke backend Laravel
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: productId,
            canva_design_id: design.designId,
            design_name: design.designTitle || "Desain Baru",
            preview_url: design.previewUrl,
            design_url: design.designUrl,
          }),
        });

        alert("🎉 Desain berhasil disimpan ke server!");
      },
    });

    canva.open();
  };

  return (
    <>
      <Script src="https://sdk.canva.com/designbutton/v2/api.js" strategy="afterInteractive" />
      <button
        onClick={handleDesign}
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
      >
        ✏️ Buat Desain dengan Canva
      </button>
    </>
  );
}
