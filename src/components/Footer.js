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
      setLocation('ភូមិABC សង្កាត់XYZ ខេត្តPhnom Penh');
    }, 500);
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="max-w-screen-md mx-auto text-center space-y-2">
        <p>📞 ទូរស័ព្ទ: 012 345 678</p>
        <p>📧 អ៊ីមែល: example@email.com</p>
        <p>🏠 ទីតាំង: {location}</p>

        <div className="mt-3 h-48 w-full rounded overflow-hidden">
          <MapWithNoSSR />
        </div>
      </div>
    </footer>
  );
}
