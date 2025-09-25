'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {fetchProductsStatus } from '../../services/productservice';
import { fetchProductImages } from '../../services/productimageservice';
import { fetchCategories } from '../../services/categoryservice';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImageIndex, setPreviewImageIndex] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const clickTimeoutRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);

        setLoading(true);
        const productsData = await fetchProductsStatus();
        setProducts(productsData);

        const imagesMap = {};
        for (const pro of productsData) {
          const images = await fetchProductImages(pro.id);
          imagesMap[pro.id] = images;
        }
        setProductImages(imagesMap);
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
    const filteredProducts = products.filter((pro) => {
    const matchesCategory = selectedCategory ? pro.category_id === Number(selectedCategory) : true;
    const matchesSearch = pro.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ទំនិញ</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 w-full sm:w-1/3"
        >
          <option value="">ប្រភេទទំនេញ</option>
          {categories.map((cate) => (
            <option key={cate.id} value={cate.id}>
              {cate.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="ស្វែងរកទំនិញទីនេះ"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 w-full sm:w-2/3"
        />
      </div>

      {/* Preview Modal */}
      {previewImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setPreviewImageIndex(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImageIndex(null)}
              className="absolute top-2 right-2 text-white text-xl font-bold"
            >
              &times;
            </button>

            <img
              src={`http://127.0.0.1:8000/storage/${previewImages[previewImageIndex]?.image_path}`}
              alt="Preview"
              className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
            />

            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={() =>
                  setPreviewImageIndex((prev) =>
                    prev > 0 ? prev - 1 : previewImages.length - 1
                  )
                }
                className="text-white text-5xl px-4"
              >
                ◀
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={() =>
                  setPreviewImageIndex((prev) =>
                    prev < previewImages.length - 1 ? prev + 1 : 0
                  )
                }
                className="text-white text-5xl px-4"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Loading...</p>}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 col-span-full">No products found.</p>
        ) : (
          filteredProducts.map((pro) => (
            <div key={pro.id} className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition duration-300">
              <div className="mb-3">
                <img
                  src={`http://127.0.0.1:8000/storage/${productImages[pro.id]?.[0]?.image_path}`}
                  alt={`Image of ${pro.name}`}
                  className="w-full h-48 object-cover rounded cursor-pointer"
                  onClick={() => {
                    setPreviewImages(productImages[pro.id]);
                    setPreviewImageIndex(0);
                  }}
                />
              </div>

              <Link href={`/userpage/${pro.id}`} className="block">
                <h2 className="text-lg font-semibold hover:underline">{pro.name}</h2>
              

              <p className="text-sm text-gray-500">💰 ${pro.price}</p>
              <p className="text-sm text-gray-600">
                📦 {categories.find(c => c.id === pro.category_id)?.name || '—'}
              </p>
                </Link>
              {/* Telegram Button */}
              <div className="mt-4 text-start">
                <a
                  href="https://t.me/leanghonghav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  កម្មង់ទីនេះ
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
