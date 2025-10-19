"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailOrPhone || !password) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_or_phone: emailOrPhone,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login gagal, periksa kembali data Anda.");
      }

      // ✅ Simpan token dan user
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("auth_user", JSON.stringify(result.data));

      // Redirect
      router.push(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#3BB5FF]">
      {/* ===================== 🖥️ DESKTOP LEFT SIDE ===================== */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center text-center p-8">
        <Image
          src="/images/design-illustration.png"
          alt="Desain Printing"
          width={500}
          height={400}
          priority
        />
        <h2 className="text-white text-2xl font-bold mt-4">MARKETPLACE</h2>
        <h3 className="text-white text-xl font-semibold">PRINTING NO 1 DI INDONESIA</h3>
        <p className="text-white mt-2 text-sm">www.sidomulyoproject.com</p>
      </div>

      {/* ===================== 📱 MOBILE & DESKTOP FORM ===================== */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#5EC7FF]/30 p-6 md:p-10 rounded-none md:rounded-l-3xl">
        <div className="w-full max-w-sm bg-white/80 md:bg-[#5EC7FF]/40 rounded-2xl p-6 md:p-8 shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/logo-sidomulyo.png" alt="Logo Sidomulyo" width={160} height={50} />
          </div>

          {/* Title khusus mobile */}
          <div className="text-center mb-5 md:hidden">
            <h2 className="text-lg font-semibold text-gray-800">Selamat Datang</h2>
            <p className="text-sm text-gray-600">Silakan masuk ke akun Anda</p>
          </div>

          {/* Form Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Masukkan email / nomor handphone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          {/* 🔹 Social Login */}
          <div className="flex justify-center mt-5 space-x-4">
            <button className="p-2 bg-white rounded-full shadow-md hover:scale-105 transition">
              <Image src="/icons/tiktok.svg" alt="TikTok" width={24} height={24} />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:scale-105 transition">
              <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:scale-105 transition">
              <Image src="/icons/google.svg" alt="Google" width={24} height={24} />
            </button>
          </div>

          {/* 🔹 Register Link */}
          <div className="text-center mt-6 text-sm text-gray-800">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-700 font-semibold hover:underline">
              Daftar Sekarang
            </Link>
            <p className="text-gray-600 text-xs mt-3 md:block hidden">
              Dengan mendaftar, saya menyetujui{" "}
              <Link href="/terms" className="text-red-600 hover:underline">
                Syarat & Ketentuan
              </Link>{" "}
              serta{" "}
              <Link href="/privacy" className="text-red-600 hover:underline">
                Kebijakan Privasi Sidomulyo Project
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
