"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaBoxOpen, FaShoppingCart, FaUser } from "react-icons/fa";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: <FaHome /> },
    { href: "/order", label: "Pesanan", icon: <FaBoxOpen /> },
    { href: "/cart", label: "Keranjang", icon: <FaShoppingCart /> },
    { href: "/profil", label: "Profil", icon: <FaUser /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md flex justify-around py-2 md:hidden z-50">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs transition-colors ${
              isActive ? "text-green-600 font-semibold" : "text-gray-500"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
