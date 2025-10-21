import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.100", // ✅ IP backend kamu
        port: "8000",              // ✅ port Laravel backend
        pathname: "/**",           // izinkan semua path (icons, storage, images)
      },
      {
        protocol: "http",
        hostname: "localhost",     // ✅ kalau kamu buka dari localhost
        port: "8000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
