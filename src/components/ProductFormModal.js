'use client';

import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/categoryservice';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import CKEditorWrapper from './CKEditorWrapper';
import dynamic from 'next/dynamic';
const CKEditorWrapper = dynamic(() => import('./CKEditorWrapper'), {
  ssr: false,
});

export default function ProductFormModal({ 
  visible, 
  onClose, 
  onSubmit, 
  editingProduct, 
}) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    detail: '',
    status: 'active',
    category_id: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load categories
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setError('');
      if (editingProduct) {
        setForm({
          name: editingProduct.name || '',
          price: editingProduct.price || '',
          detail: editingProduct.detail || '',
          status: editingProduct.status || 'active',
          category_id: editingProduct.category_id || '',
        });
      } else {
        setForm({
          name: '',
          price: '',
          detail: '',
          status: 'active',
          category_id: '',
        });
      }
    }
  }, [editingProduct, visible]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category_id) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Send JSON (no FormData needed, no file)
      await onSubmit(form);
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit product');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add Product'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
            required
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
            required
          />
           <div>
            <label className="block font-semibold mb-1">Detail</label>
            <CKEditorWrapper
              value={form.detail}
              onChange={(data) => setForm({ ...form, detail: data })}
            />
          </div>
          {/* <textarea
            name="detail"
            placeholder="Detail"
            value={form.detail}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
          /> */}

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
            required
          >
            <option value="active">Active</option>
            <option value="unactive">Unactive</option>
          </select>

          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {editingProduct ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
