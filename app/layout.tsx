import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import Footer from "@/components/Footer";

/**
 * 🌐 Layout Utama (RootLayout)
 * - Membungkus semua halaman dengan ClientLayout (navbar, dsb)
 * - Menyertakan Footer di bawah halaman
 * - Menerapkan tema dan gaya global
 */

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Frontend Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        {/* 🧭 Wrapper Layout Client-side */}
        <ClientLayout>
          <main className="flex-grow">{children}</main>
        </ClientLayout>

        {/* 🔹 Footer Global */}
        <Footer />
      </body>
    </html>
  );
}
