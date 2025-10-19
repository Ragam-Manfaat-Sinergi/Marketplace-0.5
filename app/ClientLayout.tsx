"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Daftar halaman yang tidak ingin menampilkan navbar
  const hideNavbarPaths = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarPaths.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <>
      {/* ✅ Navbar hanya tampil jika bukan di halaman login atau register */}
      {!shouldHideNavbar && <Navbar />}

      <main>{children}</main>
    </>
  );
}
