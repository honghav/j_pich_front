'use client';

import { useEffect, useState } from 'react';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../services/categoryservice';
import CategoryFormModal from '../../../components/CategoryFormModal';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleSubmit = async (formData) => {
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      if (formData.cover instanceof File) {
        payload.append('cover', formData.cover);
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
      } else {
        await createCategory(payload);
      }

      setEditingCategory(null);
      setShowModal(false);
      loadCategories();
    } catch (err) {
      console.error('Error saving category:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <button
        onClick={() => {
          setEditingCategory(null);
          setShowModal(true);
        }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Category
      </button>

      <CategoryFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Cover</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{cat.id}</td>
              <td className="border px-4 py-2">{cat.name}</td>
              <td className="border px-4 py-2">
                {cat.cover && (
                  <img
                    src={`https://seavlia.shop/storage/${cat.cover}`}
                    alt="cover"
                    className="h-12 object-cover"
                  />
                )}
              </td>
              <td className="border px-4 py-2">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setShowModal(true);
                    }}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
