'use client';

import ProductFormModal from "../../../components/ProductFormModal";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../../../services/productservice";
import { fetchProductImages,deleteProductImages, createProductImages } from "../../../services/productimageservice";
import { fetchCategories } from "../../../services/categoryservice";
import { useEffect, useState } from "react";
import ImageUploadModal from "../../../components/ImageUploadModal";
import { useRef } from "react";


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImageIndex, setPreviewImageIndex] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clickTimeoutRef = useRef(null);
  // Load categories
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load categories.');
    }
  };

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  // Load images for all products
  const loadImages = async (productsList) => {
    try {
      const imagesMap = {};
      for (const pro of productsList) {
        const images = await fetchProductImages(pro.id);
        imagesMap[pro.id] = images; // map productId -> images array
      }
      setProductImages(imagesMap);
    } catch (err) {
      console.error(err);
      setError('Failed to load images.');
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      await loadCategories();
      const productsData = await fetchProducts();
      setProducts(productsData);
      await loadImages(productsData);
    };
    init();
  }, []);

  // Handle product create/update
  const handleSubmit = async (form) => {
    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('price', form.price);
      payload.append('detail', form.detail || '');
      payload.append('status', form.status);
      payload.append('category_id', form.category_id);

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setEditingProduct(null);
      setShowModal(false);
      await loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product.');
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product.');
    }
  };

  // Toggle status
  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'active' ? 'unactive' : 'active';
      const payload = new FormData();
      payload.append('name', product.name);
      payload.append('price', product.price);
      payload.append('detail', product.detail || '');
      payload.append('status', newStatus);
      payload.append('category_id', product.category_id);

      await updateProduct(product.id, payload);
      await loadProducts();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((pro) => {
    const matchesCategory = selectedCategory ? pro.category_id === Number(selectedCategory) : true;
    const matchesSearch =
      (pro.name && pro.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pro.id && pro.id.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 w-full sm:w-1/3"
        >
          <option value="">All Categories</option>
          {categories.map((cate) => (
            <option key={cate.id} value={cate.id}>
              {cate.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 w-full sm:w-2/3"
        />
      </div>
      <div className="flex">
        <div className="m-4">
          {/* Add Product */}
          <button
            onClick={() => setShowModal(true)}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Product
          </button>
        </div>
        <div className="m-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Upload Image In A Product
          </button>
        </div>
      </div>
      {/* Product Modal */}
      <ProductFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        categories={categories}
      />

      {/* Preview Image Of our Product */}
      {previewImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setPreviewImageIndex(null)} // closes modal
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // prevents modal from closing when clicking inside
          >
            <button
              onClick={() => setPreviewImageIndex(null)}
              className="absolute top-2 right-2 text-white text-xl font-bold"
            >
              &times;
            </button>

            <img
              src={`https://j-pich-back-main-ncxtwh.laravel.cloud/storage/${previewImages[previewImageIndex]?.image_path}`}
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
                className="text-black text-5xl px-4"
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
                className="text-black text-5xl px-4"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      )}

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiUrl="https://j-pich-back-main-ncxtwh.laravel.cloud/api/productimages"
      />



      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Loading...</p>}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 col-span-full">No products found.</p>
        ) : (
          filteredProducts.map((pro) => (
            <div
              key={pro.id}
              className={`border rounded-lg p-4 shadow-sm ${
                pro.status === 'active'
                  ? 'bg-green-100 border-green-400'
                  : 'bg-orange-100 border-orange-400'
              }`}
            >
              {/* Images */}
           <div className="flex overflow-x-auto gap-2 mb-2">
            {Array.isArray(productImages[pro.id]) &&
              productImages[pro.id]?.map((img, index) => (
              <img
                key={img.id}
                src={`https://j-pich-back-main-ncxtwh.laravel.cloud/storage/${img.image_path}`}
                alt={`Image of ${pro.name}`}
                className="w-[50px] h-[50px] object-cover rounded border flex-shrink-0 cursor-pointer"
                onClick={() => {
                  if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

                  clickTimeoutRef.current = setTimeout(() => {
                    setPreviewImages(productImages[pro.id]);
                    setPreviewImageIndex(index);
                  }, 500); // wait to see if it's a double-click
                }}
                onDoubleClick={async () => {
                  if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

                  if (!confirm("Are you sure you want to delete this image?")) return;

                  try {
                    await deleteProductImages(img.id);

                    // Update UI after deleting
                    setProductImages((prev) => ({
                      ...prev,
                      [pro.id]: prev[pro.id].filter((i) => i.id !== img.id),
                    }));
                  } catch (error) {
                    console.error("Delete failed:", error);
                    alert("Failed to delete image. Please try again.");
                  }
                }}
              />
            ))}
          </div>
              {/* Product Info */}
              <div className="mb-2">
                <h2 className="text-lg font-semibold">{pro.name}</h2>
                <p className="text-sm text-gray-500">ID: {pro.id}</p>
              </div>
              <p className="text-sm">💰 Price: ${pro.price}</p>
              <p className="text-sm">
                📦 Category: {categories.find(c => c.id === pro.category_id)?.name || '—'}
              </p>
              {/* <p className="text-sm">📝 Detail: {pro.detail || '—'}</p> */}

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={pro.status === 'active'}
                    onChange={() => handleToggleStatus(pro)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors relative">
                    <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-sm">{pro.status === 'active' ? 'Active' : 'Unactive'}</span>
                </label>

                <div className="space-x-3">
                  <button
                    onClick={() => {
                      setEditingProduct(pro);
                      setShowModal(true);
                    }}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pro.id)}
                    // className="text-red-600 hover:underline text-sm"
                    className="inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
