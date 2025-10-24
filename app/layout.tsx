import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

/**
 * 🌐 Layout Utama (RootLayout)
 * - Membungkus semua halaman dengan ClientLayout (navbar, dsb)
 * - Menyertakan Footer & Menu Bawah (MobileNav)
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
      <body className="antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen relative pb-16">
        {/* 🧭 Wrapper Layout Client-side */}
        <ClientLayout>
          <main className="flex-grow">{children}</main>
        </ClientLayout>

        {/* 🔹 Footer Global */}
        <Footer />

        {/* 📱 Menu Bawah (selalu tampil di semua halaman, hanya di mobile) */}
        <MobileNav />
      </body>
    </html>
  );
}
