'use client';

import { useEffect, useState } from "react";
import {
  fetchOrders,
  createOrders,
  updateOrders,
  deleteOrders
} from "../../../services/orderserive";
import { fetchDiscoutOrders } from "../../../services/countservices";
import OrderFormModal from "../../../components/OrderFormModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [discount, setDiscount] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [error, setError] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingDiscount, setLoadingDiscount] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadDiscount = async () => {
    try {
      setLoadingDiscount(true);
      const data = await fetchDiscoutOrders(); // should return { month, total_discount }
      setDiscount(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load discount.");
    } finally {
      setLoadingDiscount(false);
    }
  };

  useEffect(() => {
    loadOrders();
    loadDiscount();
  }, []);

  const handleSubmit = async (form) => {
    try {
      const payload = new FormData();
      payload.append('numberOrder', form.numberOrder);
      payload.append('discount', form.discount);
      payload.append('product_id', form.product_id);
      payload.append('status', form.status);

      if (editingOrder) {
        await updateOrders(editingOrder.id, payload);
      } else {
        await createOrders(payload);
      }

      setEditingOrder(null);
      setShowModal(false);
      loadOrders();
      loadDiscount();
    } catch (err) {
      console.error('Error saving order:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrders(id);
      loadOrders();
      loadDiscount();
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const filteredOrders = selectedMonth
    ? orders.filter((order) => order.created_at?.startsWith(selectedMonth))
    : orders;

  const uniqueMonths = Array.from(
    new Set(orders.map((order) => order.created_at?.slice(0, 7)).filter(Boolean))
  );

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>

        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-4 py-2 w-full sm:w-auto"
          >
            <option value="">All Months</option>
            {uniqueMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Order
          </button>
        </div>
      </div>

      {discount && (
        <h2 className="text-xl font-semibold mb-4">
          🎁 Discount Total for {discount.month}: ${discount.total_discount}
        </h2>
      )}

      <OrderFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        editingOrder={editingOrder}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {(loadingOrders || loadingDiscount) && (
        <p className="text-gray-500 mb-4">Loading...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 col-span-full">No orders found for this month.</p>
        ) : (
          filteredOrders.map((order) => (
            <div
                key={order.id}
                className={`border rounded-lg p-4 shadow-sm ${
                  order.status === 'start' ? 'bg-orange-100' : 'bg-green-100'
                }`}
              >
              <h2 className="text-lg font-semibold mb-1">{order.numberOrder}</h2>
              <p className="text-sm text-gray-500 mb-2">Order ID: {order.id}</p>

              <div className="text-sm space-y-1">
                <p>🛒 Product : {order.name}</p>
                <p>💰 Price: ${order.price}</p>
                <p>🎁 Discount: ${order.discount}</p>
                <p>
                  ✅ Final Price: $
                  {(Number(order.price || 0) - Number(order.discount || 0)).toFixed(2)}
                </p>
                <p>📦 Status: {order.status}</p>
              </div>
                  <button
                  onClick={() => handlePrint(order)}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mt-2"
                >
                  Print
                </button>

              <div className="flex items-center justify-between mt-4">
                <div className=" space-x-3">
                  <button
                    onClick={() => {
                      setEditingOrder(order);
                      setShowModal(true);
                    }}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
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
const handlePrint = (order) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt - Order ${order.numberOrder}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          .receipt {
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 10px;
            width: 300px;
            margin: 0 auto;
          }
          .receipt p {
            margin: 6px 0;
            font-size: 14px;
          }
          .total {
            font-weight: bold;
            font-size: 16px;
            margin-top: 10px;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <h1>🧾 Receipt</h1>
        <div class="receipt">
          <p><b>Order Number:</b> ${order.numberOrder}</p>
          <p><b>Order ID:</b> ${order.id}</p>
          <p><b>Product:</b> ${order.name}</p>
          <p><b>Price:</b> $${order.price}</p>
          <p><b>Discount:</b> $${order.discount}</p>
          <p class="total">Final: $${(Number(order.price) - Number(order.discount)).toFixed(2)}</p>
          <p><b>Status:</b> ${order.status}</p>
          <p><b>Date:</b> ${order.created_at}</p>
        </div>
        <script>
          window.print();
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
