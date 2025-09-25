"use client";
import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productservice";
import Select from 'react-select';

export default function ImageUploadModal({
  isOpen,
  onClose,
  apiUrl = "http://localhost:8000/api/productimages",
}) {
  const [files, setFiles] = useState([]);
  const [productId, setProductId] = useState("1");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadProducts();
  }, [isOpen]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files.length) {
      alert("Please select at least one file");
      return;
    }

  const formData = new FormData();
  formData.append("product_id", productId);

  Array.from(files).forEach((file) => {
    formData.append("image_path[]", file);
  });

  setLoading(true);
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResponse(data);

    // ✅ Auto-close modal on success
    if (res.ok) {
      onClose();
    } else {
      setError(data?.message || "Upload failed. Please try again.");
    }
  } catch (error) {
    console.error("Upload failed:", error);
    setError("Upload failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4">Upload Product Images</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <label className="block mb-2 font-semibold">Select Product:</label>
            <Select
            options={products.map((pro) => ({
                value: pro.id,
                label: `${pro.id} - ${pro.name}`, // show both ID + name
            }))}
            value={
                products.find((p) => p.id == productId)
                ? { value: productId, label: `${productId} - ${products.find((p) => p.id == productId).name}` }
                : null
            }
            onChange={(selected) => setProductId(selected.value)}
            isSearchable
            placeholder="Search product by name or ID..."
            className="mb-4"
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        
      </div>
    </div>
  );
}
