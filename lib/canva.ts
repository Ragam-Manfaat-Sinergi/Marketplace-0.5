/**
 * 🖌️ Canva SDK Integration
 * Menghubungkan tombol "Design Now" dengan Canva Editor
 */

declare global {
  interface Window {
    Canva?: any;
  }
}

export async function loadCanvaSDK(): Promise<any> {
  // Cegah multiple load
  if (window.Canva) return window.Canva;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://sdk.canva.com/designbutton/v2/sdk.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ Canva SDK Loaded");
      resolve(window.Canva);
    };
    script.onerror = () => reject("❌ Gagal memuat Canva SDK");
    document.body.appendChild(script);
  });
}

export function openCanvaEditor(
  containerId: string,
  productName: string,
  onExport: (designUrl: string) => void
) {
  if (!window.Canva) {
    console.error("❌ Canva SDK belum dimuat");
    return;
  }

  const canvaApp = new window.Canva.DesignButton({
    apiKey: process.env.NEXT_PUBLIC_CANVA_API_KEY, // Pastikan kamu isi di .env
    container: document.getElementById(containerId),
    onDesignExported: (exportData: any) => {
      const designUrl = exportData.exportUrl;
      console.log("🎨 Design exported:", designUrl);
      onExport(designUrl);
    },
    onError: (err: any) => {
      console.error("❌ Canva error:", err);
      alert("Gagal membuka editor Canva");
    },
  });

  canvaApp.createDesign({
    name: productName,
    designType: "A4", // bisa diganti: poster, logo, flyer, dsb
  });
}
