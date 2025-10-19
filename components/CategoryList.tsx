export default function CategoryCarousel() {
  const categories = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `Kategori ${i + 1}`,
  }));

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="min-w-[100px] bg-gray-200 rounded-lg p-2 text-center text-sm"
          >
            <img
              src="/placeholder.png"
              alt={cat.name}
              className="w-full h-16 object-cover rounded"
            />
            <p className="mt-1 font-medium">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
