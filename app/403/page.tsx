export default function ForbiddenPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold mb-3 text-red-600">403 - Akses Ditolak</h1>
      <p>Halaman ini hanya bisa diakses oleh reseller.</p>
    </div>
  );
}
