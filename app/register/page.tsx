"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<Record<string, string[]>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError({});

    try {
      // Ambil API URL dari env (fallback ke IP lokal)
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://192.168.1.100:8000/api/marketplace";

      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      // Coba parse JSON dengan aman
      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setMessage("✅ Pendaftaran berhasil! Mengarahkan ke halaman login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);

        // Reset form
        setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          password_confirmation: "",
        });
      } else {
        // Validasi Laravel (422) atau error lain
        setError(data.errors || {});
        setMessage(data.message || "❌ Gagal mendaftar. Coba lagi.");
      }
    } catch (error) {
      console.error("❌ Register Error:", error);
      setMessage("❌ Tidak dapat terhubung ke server. Periksa koneksi backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Daftar Akun Marketplace
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Nama */}
        <FormGroup
          label="Nama Lengkap"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={error.name}
        />

        {/* Email */}
        <FormGroup
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={error.email}
        />

        {/* Nomor HP */}
        <FormGroup
          label="Nomor HP"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Contoh: 081234567890"
          pattern="[0-9]+"
          error={error.phone}
        />

        {/* Password */}
        <FormGroup
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={error.password}
        />

        {/* Konfirmasi Password */}
        <FormGroup
          label="Konfirmasi Password"
          name="password_confirmation"
          type="password"
          value={form.password_confirmation}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: loading ? "#999" : "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Memproses..." : "Daftar Sekarang"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
            color: message.includes("✅") ? "green" : "red",
            fontWeight: "500",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

// ✅ Komponen kecil untuk field input agar bersih
interface FormGroupProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string[];
}

function FormGroup({ label, error, ...props }: FormGroupProps) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label>{label}</label>
      <input {...props} required style={inputStyle} />
      {error && <small style={errorStyle}>{error[0]}</small>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginTop: "5px",
};

const errorStyle: React.CSSProperties = {
  color: "red",
  fontSize: "12px",
};
