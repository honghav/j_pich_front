'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = (path) =>
    `block px-4 py-2 rounded hover:bg-gray-200 ${
      pathname === path ? 'bg-blue-600 text-white' : 'text-gray-800'
    }`;

  return (
    <nav className="bg-yellow-300 border-b font-bold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Title */}
          <div className="text-xl">Admin Panel</div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4">
            <Link href="/adminpage" className={linkClasses('/')}>
              Home
            </Link>
            <Link href="/adminpage/categories" className={linkClasses('/categories')}>
              Categories
            </Link>
            <Link href="/adminpage/products" className={linkClasses('/products')}>
              Products
            </Link>
            <Link href="/adminpage/orders" className={linkClasses('/orders')}>
              Orders
            </Link>
            <Link href="/adminpage/anotherpays" className={linkClasses('/anotherpays')}>
              AnotherPays
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded hover:bg-gray-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden px-2 pb-3 space-y-1">
          <Link href="/adminpage" className={linkClasses('/')}>
            Home
          </Link>
          <Link href="/adminpage/categories" className={linkClasses('/categories')}>
            Categories
          </Link>
          <Link href="/adminpage/products" className={linkClasses('/products')}>
            Products
          </Link>
          <Link href="/adminpage/orders" className={linkClasses('/orders')}>
            Orders
          </Link>
          <Link href="/adminpage/anotherpays" className={linkClasses('/anotherpays')}>
            AnotherPays
          </Link>
        </div>
      )}
    </nav>
  );
}
