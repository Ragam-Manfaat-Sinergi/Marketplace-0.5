export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4 text-sm text-gray-700">
        <div>
          <h4 className="font-semibold mb-2">Sidomulyo Project</h4>
          <ul className="space-y-1">
            <li>Tentang</li>
            <li>Karir</li>
            <li>Promo</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Bantuan</h4>
          <ul className="space-y-1">
            <li>Sidomulyo Care</li>
            <li>Syarat dan Ketentuan</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Partner</h4>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-300 h-8 rounded"></div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Keuntungan</h4>
          <ul className="space-y-1">
            <li>Diskon 20%</li>
            <li>Gratis ongkir</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
