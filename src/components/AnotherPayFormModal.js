'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const CKEditorWrapper = dynamic(() => import('./CKEditorWrapper'), {
  ssr: false,
});

export default function AnotherPayFormModal({ visible, onClose, onSubmit, editingPay }) {
  const [form, setForm] = useState({ price: '', note: '' });

  useEffect(() => {
    if (editingPay) {
      setForm({
        price: editingPay.price,
        note: editingPay.note,
      });
    } else {
      setForm({ price: '', note: '' });
    }
  }, [editingPay]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4">
          {editingPay ? 'Edit Payment' : 'Add Payment'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Note</label>
            <CKEditorWrapper
              value={form.note}
              onChange={(data) => setForm({ ...form, note: data })}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            {editingPay ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
}
