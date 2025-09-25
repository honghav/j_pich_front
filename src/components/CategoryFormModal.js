'use client';

import { useState, useEffect } from 'react';

export default function CategoryFormModal({ visible, onClose, onSubmit, editingCategory }) {
  const [form, setForm] = useState({ name: '', cover: null });

  useEffect(() => {
    if (editingCategory) {
      setForm({ name: editingCategory.name, cover: null });
    } else {
      setForm({ name: '', cover: null });
    }
  }, [editingCategory, visible]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cover' && files) {
      setForm({ ...form, cover: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', cover: null });
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {editingCategory ? 'Edit Category' : 'Add Category'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
            required
          />
          <input
            type="file"
            name="cover"
            accept="image/*"
            onChange={handleChange}
            className="border px-4 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {editingCategory ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      </div>
    </div>
  );
}
