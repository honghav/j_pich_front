'use client';
import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productservice";
import Select from 'react-select';
export default function OrderFormModal({
    visible, 
    onClose, 
    onSubmit, 
    editingOrder, 
    }) {
    const [form, setForm] = useState({
        numberOrder: '',
        discount: '',
        product_id: '',
        status: 'start',
    });

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProduct(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load Order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);


  useEffect(() => {
    if (editingOrder) {
      setForm({
        numberOrder: editingOrder.numberOrder || '',
        discount: editingOrder.discount || '',
        product_id: editingOrder.product_id || '',
        status: editingOrder.status || 'start',
      });
    } else {
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
      setForm({
        numberOrder: `ORD-${timestamp}`,
        discount: '',
        product_id: '',
        status: 'start',
      });
    }
  }, [editingOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };
  const productOptions = product.map((pro) => ({
    value: pro.id,
    label: `${pro.id}: ${pro.name}`,
    }));

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
          {editingOrder ? 'Edit Orders' : 'Add Orders'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="numberOrder"
            placeholder="Number Order"
            value={form.numberOrder}
            className="border px-4 py-2 w-full bg-gray-100 cursor-not-allowed"
            readOnly
          />

          <input
            type="text"
            name="discount"
            placeholder="Discount"
            value={form.discount}
            onChange={handleChange}
            className="border px-4 py-2 w-full" 
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
          >
            <option value="start">Start</option>
            <option value="done">Done</option>
          </select>
          {/* <select
            name="product_id"
            value={form.product_id}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
            required
          >
            <option value="">Select Product</option>
            {product.map((pro) => (
              <option key={pro.id} value={pro.id}>
                {pro.id}:{pro.name}
              </option>
            ))}
          </select> */}
        

          <Select 
            name="product_id"
            value={productOptions.find((opt) => opt.value === form.product_id)}
            onChange={(selected) =>
              setForm({ ...form, product_id: selected ? selected.value : '' })
            }
            options={productOptions}
            className="w-full"
            placeholder="Select Product..."
            isSearchable
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {editingOrder ? 'Update Orders' : 'Create Orders'}
          </button>
        </form>
      </div>
    </div>
  );
}
