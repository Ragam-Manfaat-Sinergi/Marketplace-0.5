"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const result = await res.json();
        if (result.success && result.data) {
          setUser(result.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Gagal memuat user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch {
        // abaikan error logout backend
      }
    }
    localStorage.removeItem("auth_token");
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="w-full bg-white border-b border-gray-200 py-3 text-center text-gray-500">
        Memuat...
      </div>
    );
  }

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      {/* ================== 🖥️ DESKTOP NAVBAR ================== */}
      <div className="hidden md:block">
        {/* 🔹 TOP BAR */}
        <div className="w-full bg-gray-50 text-xs text-gray-600 border-b border-gray-200">
          <div className="w-full flex items-center justify-between px-8 h-8">
            <span>Gratis Ongkir + Banyak Promo belanja di aplikasi</span>
            <div className="flex gap-5 text-gray-600">
              <Link href="/tentang" className="hover:text-blue-600">
                Tentang Sidomulyo
              </Link>
              <Link href="/edukasi" className="hover:text-blue-600">
                Pusat Edukasi Reseller & Affiliate
              </Link>
              <Link href="/promo" className="hover:text-blue-600">
                Promo
              </Link>
              <Link href="/care" className="hover:text-blue-600">
                Sidomulyo Care
              </Link>
            </div>
          </div>
        </div>

        {/* 🔹 MAIN NAVBAR */}
        <div className="w-full flex items-center justify-between px-8 py-3 bg-white">
          {/* 🟩 Logo dan kategori */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Sidomulyo" className="w-32 h-auto" />
            </Link>

            <Link
              href="/kategori"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Kategori
            </Link>
          </div>

          {/* 🔍 Search bar */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-1.5 transition-all duration-200 hover:shadow-[0_0_8px_rgba(0,0,0,0.05)]">
              <Image
                src="/icons/search.svg"
                alt="Cari"
                width={18}
                height={18}
                className="opacity-70"
              />
              <input
                type="text"
                placeholder="Cari di Sidomulyo"
                className="flex-1 px-3 py-1 text-sm outline-none bg-transparent"
              />
            </div>
          </div>

          {/* 🔹 Right Icons */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-1 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1 text-sm font-medium bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Daftar
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/keranjang" className="relative hover:scale-110 transition">
                <Image src="/icons/keranjang.svg" alt="Keranjang" width={22} height={22} />
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">
                  1
                </span>
              </Link>

              <Link href="/notifikasi" className="hover:scale-110 transition">
                <Image src="/icons/notifikasi.svg" alt="Notifikasi" width={22} height={22} />
              </Link>

              <Link href="/chat" className="hover:scale-110 transition">
                <Image src="/icons/chat.svg" alt="Chat" width={22} height={22} />
              </Link>

              <Link href="/desain" className="hover:scale-110 transition">
                <Image src="/icons/desain.svg" alt="Desain" width={22} height={22} />
              </Link>

              <div className="relative group">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:scale-105 transition">
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg hidden group-hover:block">
                  <p className="px-4 py-2 text-sm text-gray-600 border-b">{user.name}</p>
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Profil Saya
                  </Link>
                  <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================== 📱 MOBILE NAVBAR ================== */}
      <div className="md:hidden px-4 py-2 flex items-center justify-between bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
        <Link href="/">
          <img src="/logo.png" alt="Sidomulyo" className="w-28 h-auto" />
        </Link>

        {!user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              Daftar
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/keranjang">
              <Image src="/icons/keranjang.svg" alt="Keranjang" width={22} height={22} />
            </Link>
            <Link href="/notifikasi">
              <Image src="/icons/notifikasi.svg" alt="Notifikasi" width={22} height={22} />
            </Link>
            <Link href="/chat">
              <Image src="/icons/chat.svg" alt="Chat" width={22} height={22} />
            </Link>
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
              <span className="text-xs font-semibold text-gray-700">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden px-4 pb-2 bg-white border-t border-gray-200">
        <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-1.5">
          <Image
            src="/icons/search.svg"
            alt="Cari"
            width={18}
            height={18}
            className="opacity-70"
          />
          <input
            type="text"
            placeholder="Cari di Sidomulyo"
            className="flex-1 px-3 py-1 text-sm outline-none bg-transparent"
          />
        </div>
      </div>
    </header>
  );
}
