'use client';
import { useEffect, useState,  } from "react";
import { fetchCountAnother,
      fetchCountOrder,
      fetchSumOrder,
      fetchSumAnother,
      fetchCountProducts
    } from "../../services/countservices";
export default function DashbordPage(){
    const [countAnother , setCountAnother] = useState();
    const [countOrder , setCountOrder] = useState();
    const [sumAnother , setSumAnother] = useState();
    const [countProducts , setCountProducts] = useState();
    const [sumOrder , setSumOrder] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const loadCountProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchCountProducts();
      setCountProducts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
    };
    const loadCountAnother = async () => {
    try {
      setLoading(true);
      const data = await fetchCountAnother();
      setCountAnother(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
    };
    const loadCountOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchCountOrder();
      setCountOrder(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
    };
    const loadSumAnother = async () => {
    try {
      setLoading(true);
      const data = await fetchSumAnother();
      setSumAnother(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
    };
    const loadSumOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchSumOrder();
      setSumOrder(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
    };

      useEffect(() => {
        loadCountAnother();
        loadCountOrder();
        loadSumAnother();
        loadSumOrder();
        loadCountProducts();
      }, []); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (

    <div className="p-4 max-w-screen-md mx-auto space-y-6">
    {/* Non Print  */}
    <h1 className="text-xl font-bold text-center">ចំនួនរបស់​សរុប</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">All Products</h2>
        <p className="text-3xl font-bold text-blue-500">{countProducts?.allProduct ?? 0}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Active Products</h2>
        <p className="text-3xl font-bold text-green-500">{countProducts?.productActive ?? 0}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Inactive Products</h2>
        <p className="text-3xl font-bold text-red-500">{countProducts?.productUnactive ?? 0}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Categories</h2>
        <p className="text-3xl font-bold text-purple-500">{countProducts?.allCategory ?? 0}</p>
      </div>
    </div>

    <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-green-100 to-green-200 shadow-md rounded-2xl p-6 border border-green-300">
      <p className="text-gray-700 text-lg font-semibold">
        ប្រាក់ចំណូលសរុបប្រចាំខែ
      </p>
      <p>
        Total Money: $
        {Number(sumAnother?.this_month_total) + Number(sumOrder?.this_month_total)}
      </p>
    </div>
    
    {/* Print 1*/}
    <h1 className="text-xl font-bold text-center">ប្រាក់ចំណូលពីការកម្មង់</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Income This Month */}
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <p className="text-gray-500 text-sm">ចំំណូលការលក់ក្នុងខែនេះ</p>
      <p className="text-3xl font-bold text-green-600">
        ${sumOrder?.this_month_total ?? 0}
      </p>
    </div>

    {/* Sales Count This Month */}
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <p className="text-gray-500 text-sm">ចំនួនការលក់ក្នុងខែនេះ</p>
      <p className="text-3xl font-bold text-blue-600">
        {countOrder?.this_month_count ?? 0}
      </p>
    </div>

    {/* Income Last Month */}
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <p className="text-gray-500 text-sm">ចំំណូលការលក់ក្នុងខែមុន</p>
      <p className="text-2xl font-semibold text-orange-500">
        ${sumOrder?.last_month_total ?? 0}
      </p>
    </div>

    {/* Sales Count Last Month */}
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <p className="text-gray-500 text-sm">ចំនួនការលក់ក្នុងខែមុន</p>
      <p className="text-2xl font-semibold text-purple-500">
        {countOrder?.last_month_count ?? 0}
      </p>
    </div>

    {/* Growth Percentage */}
    <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-green-100 to-green-200 shadow-md rounded-2xl p-6 border border-green-300">
      <p className="text-gray-700 text-lg font-semibold">
        កំណើនប្រាក់ចំណូល
      </p>
      <p className="text-4xl font-bold text-green-700">
        {sumOrder?.percentage ?? 0}% 🚀
      </p>
    </div>
  </div>
{/* Print 2 */}
    <h1 className="text-xl font-bold text-center">ប្រាក់ចំណូលផ្សេងផ្សេង</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Income This Month */}
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <p className="text-gray-500 text-sm">ចំំណូលការលក់ក្នុងខែនេះ</p>
      <p className="text-3xl font-bold text-green-600">
        ${sumAnother?.this_month_total ?? 0}
      </p>
    </div>

    {/* Sales Count This Month */}
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <p className="text-gray-500 text-sm">ចំនួនការលក់ក្នុងខែនេះ</p>
      <p className="text-3xl font-bold text-blue-600">
        {countAnother?.this_month_count ?? 0}
      </p>
    </div>

    {/* Income Last Month */}
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <p className="text-gray-500 text-sm">ចំំណូលការលក់ក្នុងខែមុន</p>
      <p className="text-2xl font-semibold text-orange-500">
        ${sumAnother?.last_month_total ?? 0}
      </p>
    </div>

    {/* Sales Count Last Month */}
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <p className="text-gray-500 text-sm">ចំនួនការលក់ក្នុងខែមុន</p>
      <p className="text-2xl font-semibold text-purple-500">
        {countAnother?.last_month_count ?? 0}
      </p>
    </div>

    {/* Growth Percentage */}
    <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-green-100 to-green-200 shadow-md rounded-2xl p-6 border border-green-300">
      <p className="text-gray-700 text-lg font-semibold">
        កំណើនប្រាក់ចំណូល
      </p>
      <p className="text-4xl font-bold text-green-700">
        {sumAnother?.percentage ?? 0}% 🚀
      </p>
    </div>
  </div>
  </div>
  );    
}

