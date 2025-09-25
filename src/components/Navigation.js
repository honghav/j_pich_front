'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const linkClasses = (path) =>
    `px-4 py-2 rounded hover:bg-gray-200 ${
      pathname === path ? 'bg-blue-600 text-white' : 'text-gray-800'
    }`;

  return (
    <nav className="flex space-x-4 p-4 border-b bg-yellow-300 font-bold">
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
      {/* <Link href="/userpage/plateform" className={linkClasses('/userpage/plateform')}>
        UserPage
      </Link> */}
    </nav>
  );
}
