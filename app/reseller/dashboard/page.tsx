"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardData {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  reseller: {
    id: number;
    commission_balance: number;
  } | null;
  total_orders: number;
  total_commission: number;
}

export default function ResellerDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("auth_user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    const role = parsedUser.role?.toLowerCase();

    if (role !== "reseller" && role !== "super admin") {
      router.push("/403");
      return;
    }

    fetchDashboard(token);
  }, [router]);

  const fetchDashboard = async (token: string) => {
    try {
      const res = await fetch("http://192.168.1.100:8000/api/marketplace/reseller/dashboard", {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal memuat data dashboard.");

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError("Tidak dapat memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Memuat data dashboard reseller...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">📊 Dashboard Reseller</h1>

      {data ? (
        <>
          {/* Statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <StatCard label="Total Pesanan" value={data.total_orders} color="blue" />
            <StatCard
              label="Total Komisi"
              value={`Rp ${data.total_commission.toLocaleString("id-ID")}`}
              color="green"
            />
            <StatCard
              label="Saldo Komisi"
              value={`Rp ${data.reseller?.commission_balance?.toLocaleString("id-ID") ?? 0}`}
              color="orange"
            />
          </div>

          {/* Informasi Akun */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">👤 Informasi Akun</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Nama: <strong>{data.user.name}</strong></li>
              <li>Email: {data.user.email}</li>
              <li>Role: {data.user.role}</li>
            </ul>

            <button
              onClick={() => router.push("/reseller")}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              🛍️ Lihat Produk Reseller
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">Tidak ada data dashboard.</p>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "blue" | "green" | "orange";
}) {
  const colorClass =
    color === "blue"
      ? "text-blue-600"
      : color === "green"
      ? "text-green-600"
      : "text-orange-600";

  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <p className="text-gray-500 mb-1">{label}</p>
      <h2 className={`text-3xl font-bold ${colorClass}`}>{value}</h2>
    </div>
  );
}
