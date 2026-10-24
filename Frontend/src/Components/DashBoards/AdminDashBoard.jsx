import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // ✅ Updated: Using central API instance instead of hardcoded localhost
import {
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiPlus,
  FiBox,
  FiArrowUpRight,
  FiRefreshCw
} from 'react-icons/fi';

const AdminDashBoard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await API.get('/order/admin/stats');

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
          setRecentOrders(statsRes.data.recentOrders);
        }

        const productsRes = await API.get('/products');
        const productData = Array.isArray(productsRes.data)
          ? productsRes.data
          : (productsRes.data.products || productsRes.data.allProducts || []);
        setProducts(productData);

      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleEditChange = (id, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleUpdateProduct = async (product) => {
    const edit = edits[product._id] || {};
    const payload = {};

    if (edit.addStock !== undefined && edit.addStock !== '') {
      const qty = Number(edit.addStock);
      if (!Number.isInteger(qty) || qty <= 0) {
        alert("Stock to add must be a whole number greater than 0");
        return;
      }
      payload.addStock = qty;
    }

    if (edit.price !== undefined && edit.price !== '') {
      const newPrice = Number(edit.price);
      if (!Number.isFinite(newPrice) || newPrice < 0) {
        alert("Price must be a number, 0 or more");
        return;
      }
      payload.price = newPrice;
    }

    if (Object.keys(payload).length === 0) {
      alert("Enter stock to add or a new price.");
      return;
    }

    try {
      setUpdatingId(product._id);
      const response = await API.patch(`/products/update-stock/${product._id}`, payload);

      if (response.data.success) {
        const updated = response.data.product;
        setProducts((prev) =>
          prev.map((p) =>
            p._id === product._id
              ? { ...p, price: updated.price, stock: updated.stock }
              : p
          )
        );
        setEdits((prev) => ({
          ...prev,
          [product._id]: { addStock: '', price: '' }
        }));
        alert(`✅ ${response.data.message}`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update product");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await API.patch(`/order/status/${orderId}`, {
        status: newStatus
      });

      if (response.data.success) {
        setRecentOrders(recentOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        alert("✅ Order status successfully updated!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Status can't be update");
    }
  };

  const formatOrderId = (id) => {
    if (!id) return "";
    return `#${id.slice(0, 6)}...${id.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans mt-5">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Welcome back, Admin! Here is the live store performance and inventory management.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/ProductRegister")}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <FiPlus className="w-5 h-5" />
              Create New Product
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer"
            >
              All Products
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Sales</span>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <FiDollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900">${stats.totalSales.toLocaleString()}</h3>
              <span className="text-emerald-600 text-xs font-semibold flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
                <FiArrowUpRight className="w-3 h-3 mr-0.5" /> Live
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span>Updated from MongoDB database</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <FiTrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900">${(stats.totalSales * 0.8).toFixed(2)}</h3>
              <span className="text-emerald-600 text-xs font-semibold flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
                <FiArrowUpRight className="w-3 h-3 mr-0.5" /> +8.4%
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span>Estimated net profit calculation</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Orders Status</span>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <FiShoppingBag className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalOrders}</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <FiClock className="w-3.5 h-3.5" /> Pending: {stats.pendingOrders}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <FiCheckCircle className="w-3.5 h-3.5" /> Completed: {stats.completedOrders}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Store Health</span>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FiBox className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-emerald-600">Active</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span>Database connected successfully</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Inventory & Stock Control</h3>
              <p className="text-slate-500 text-sm">Add stock or change the price of existing medicines without creating new ones</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-6 text-gray-400">Loading products inventory...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-6 text-gray-400">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((prod) => {
                const isUpdating = updatingId === prod._id;

                return (
                  <div key={prod._id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-800 truncate" title={prod.name}>{prod.name}</h4>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${prod.stock <= 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                          {prod.stock <= 0 ? 'Out of Stock' : `Stock: ${prod.stock}`}
                        </span>
                      </div>
                      <p className="text-indigo-600 font-bold text-sm mb-3">${prod.price}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Add stock"
                          value={edits[prod._id]?.addStock ?? ''}
                          onChange={(e) => handleEditChange(prod._id, 'addStock', e.target.value)}
                          className="w-1/2 border border-slate-300 rounded-lg px-2 py-1.5 text-xs bg-white"
                        />
                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder="New price"
                          value={edits[prod._id]?.price ?? ''}
                          onChange={(e) => handleEditChange(prod._id, 'price', e.target.value)}
                          className="w-1/2 border border-slate-300 rounded-lg px-2 py-1.5 text-xs bg-white"
                        />
                      </div>
                      <button
                        onClick={() => handleUpdateProduct(prod)}
                        disabled={isUpdating}
                        className={`w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg transition ${
                          isUpdating
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-slate-800 hover:bg-slate-900 text-white cursor-pointer'
                        }`}
                      >
                        <FiRefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                        {isUpdating ? 'Updating...' : 'Update Stock / Price'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Recent Live Orders</h3>
              <p className="text-slate-500 text-sm">Real-time transactions from your store customers</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading live orders...</div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No orders found in database yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer Name</th>
                    <th className="pb-3">Items Count</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 font-mono font-medium text-indigo-600 text-xs" title={order._id}>
                        {formatOrderId(order._id)}
                      </td>

                      <td className="py-3.5 text-slate-700 font-medium">
                        {typeof order.user === 'object' && order.user !== null ? (
                          order.user.role === 'admin' || order.user.isAdmin ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              Admin
                            </span>
                          ) : (
                            order.user.name || "Customer"
                          )
                        ) : (
                          "Admin"
                        )}
                      </td>

                      <td className="py-3.5 text-slate-600">{order.items ? order.items.length : 0} items</td>
                      <td className="py-3.5 font-semibold text-slate-900">${order.totalAmount}</td>
                      <td className="py-3.5">
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer outline-none transition-all ${
                            order.status === 'Completed' || order.status === 'Delivered' || order.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Completed">Completed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashBoard;