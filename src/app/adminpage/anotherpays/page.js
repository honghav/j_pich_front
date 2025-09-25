'use client';

import { useEffect, useState } from "react";
import {
  fetchAnotherPays,
  createAnotherPays,
  updateAnotherPays,
  deleteAnotherPays
} from "../../../services/anotherpayservices";
import AnotherPayFormModal from "../../../components/AnotherPayFormModal";

export default function AnotherPaysPage() {
  const [anotherPays, setAnotherPays] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [error, setError] = useState(null);
  const [loadingPays, setLoadingPays] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPay, setEditingPay] = useState(null);

  const loadAnotherPay = async () => {
    try {
      setLoadingPays(true);
      const data = await fetchAnotherPays();
      setAnotherPays(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load payments.");
    } finally {
      setLoadingPays(false);
    }
  };

  useEffect(() => {
    loadAnotherPay();
  }, []);

  const handleSubmit = async (form) => {
    try {
      const payload = new FormData();
      payload.append("price", form.price);
      payload.append("note", form.note);

      if (editingPay) {
        await updateAnotherPays(editingPay.id, payload);
      } else {
        await createAnotherPays(payload);
      }

      setEditingPay(null);
      setShowModal(false);
      loadAnotherPay();
    } catch (err) {
      console.error("Error saving payment:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnotherPays(id);
      loadAnotherPay();
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };

  // ✅ Print receipt
  const handlePrint = (pays) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - Payment ${pays.id}</title>
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
            .receipt p { margin: 6px 0; font-size: 14px; }
            .total { font-weight: bold; font-size: 16px; margin-top: 10px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>🧾 Receipt</h1>
          <div class="receipt">
            <p><b>Payment ID:</b> ${pays.id}</p>
            <p><b>💰 Price:</b> $${pays.price}</p>
            <p><b>📝 Note:</b></p>
            <div>${pays.note || "No note provided"}</div>
            <p><b>Date:</b> ${pays.created_at || "N/A"}</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ✅ Filter by month
  const filteredPays = selectedMonth
    ? anotherPays.filter((pays) => pays.created_at?.startsWith(selectedMonth))
    : anotherPays;

  const uniqueMonths = Array.from(
    new Set(anotherPays.map((p) => p.created_at?.slice(0, 7)).filter(Boolean))
  );

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Another Pays</h1>

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
            Add Payment
          </button>
        </div>
      </div>

      <AnotherPayFormModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPay(null);
        }}
        onSubmit={handleSubmit}
        editingPay={editingPay}
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loadingPays && <p className="text-gray-500 mb-4">Loading...</p>}

      <div className="space-y-4">
        {filteredPays.length === 0 ? (
          <p className="text-gray-500">No payments found for this month.</p>
        ) : (
          filteredPays.map((pays) => (
            <div key={pays.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <p className="text-sm text-gray-600">🆔 ID: {pays.id}</p>
              <p className="text-sm text-green-700">💰 Price: ${pays.price}</p>
              <div
                className="text-sm text-gray-800"
                dangerouslySetInnerHTML={{ __html: pays.note }}
              ></div>

              <div className="flex justify-start space-x-3 mt-3">
                <button
                  onClick={() => handlePrint(pays)}
                  className="min-w-[90px] text-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Print
                </button>
                <button
                  onClick={() => {
                    setEditingPay(pays);
                    setShowModal(true);
                  }}
                  className="min-w-[90px] text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pays.id)}
                  className="min-w-[90px] text-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
