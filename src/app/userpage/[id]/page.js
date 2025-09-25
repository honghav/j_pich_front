'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProductById } from '../../../services/productservice';
import { fetchProductImages } from '../../../services/productimageservice';
import { fetchCategories } from '../../../services/categoryservice';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      try {
        const pro = await fetchProductById(id);
        const imgs = await fetchProductImages(id);
        const cats = await fetchCategories();
        const cat = cats.find(c => c.id === pro.category_id)?.name || '—';

        setProduct(pro);
        setImages(imgs);
        setCategory(cat);
      } catch (err) {
        console.error(err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (loading || !product) return <p className="text-gray-500 p-4">Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row p-4 max-w-4xl mx-auto border rounded shadow-sm bg-white">
      {/* Image Gallery */}
      <div className="md:w-1/2">
        {/* Display first image */}
        {images.length > 0 && (
          <img
            src={`https://j-pich-back-main-ncxtwh.laravel.cloud/storage/${images[0].image_path}`}
            alt={product.name}
            className="w-full h-64 object-cover rounded mb-4 cursor-pointer"
            onClick={() => setCurrentImageIndex(0)}
          />
        )}

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, index) => (
            <img
              key={img.id}
              src={`https://j-pich-back-main-ncxtwh.laravel.cloud/storage/${img.image_path}`}
              alt={`Image ${index + 1}`}
              className="w-20 h-20 object-cover rounded border cursor-pointer"
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="md:w-1/2 md:pl-6">
        <h1 className="text-2xl font-bold mb-2">ឈ្មោះទំនិញ: {product.name}</h1>
        <h1 className="text-xl font-bold mb-2">លេខកូត​ទំនិញ: {product.id}</h1>
        <p className="text-lg mb-2">💰 តម្លៃ: $ <span className="text-green-800 font-bold text-2xl">{product.price}</span></p>
        <p className="text-md mb-2">📦 ប្រភេទទំនេញ: {category}</p>
        <div className="mt-4 ">
            <a
              href="https://t.me/leanghonghav"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              កម្មង់ទីនេះ
            </a>
        </div>
        
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">📝 Description</h2>
        <div
        className="text-gray-700 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: product.detail || '<p>No description available.</p>' }}
        ></div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {currentImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setCurrentImageIndex(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setCurrentImageIndex(null)}
              className="absolute top-2 right-2 text-white text-xl font-bold"
            >
              &times;
            </button>

            <img
              src={`https://j-pich-back-main-ncxtwh.laravel.cloud/storage/${images[currentImageIndex]?.image_path}`}
              alt="Preview"
              className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
            />

            {/* Previous */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev > 0 ? prev - 1 : images.length - 1
                  )
                }
                className="text-white text-5xl px-4"
              >
                ◀
              </button>
            </div>

            {/* Next */}
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev < images.length - 1 ? prev + 1 : 0
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
    </div>
  );
}
