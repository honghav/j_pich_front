'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MapContainer and related components
const MapWithNoSSR = dynamic(
  () => import('./MiniMap'), // MiniMap component (client-side only)
  { ssr: false }
);

export default function Footer() {
  const [location, setLocation] = useState('កំពុងផ្ទុកទីតាំង...');

  useEffect(() => {
    setTimeout(() => {
      setLocation('ភូមិស្នួល សង្កាត់ស្នួល ខេត្តក្រចេះ');
    }, 500);
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="max-w-screen-md mx-auto text-center space-y-2">
        <p>
          📞 ទូរស័ព្ទ:{" "}
          <a href="tel:0889464747" className="text-blue-600 hover:underline">
            088 946 4747
          </a>
        </p>

        <p>
          📧 តេលេក្រាម:{" "}
          <a
            href="https://t.me/Sl_Decors"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Sl Decors
          </a>
        </p>
        <p>🏠 ទីតាំង: {location}</p>

        <div className="mt-3 h-48 w-full rounded overflow-hidden">
          <MapWithNoSSR />
        </div>
      </div>
    </footer>
  );
}
