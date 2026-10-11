import React from 'react';
import { 
  FiShoppingBag, 
  FiDollarSign, 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle, 
  FiPlus, 
  FiUsers, 
  FiBox, 
  FiArrowUpRight 
} from 'react-icons/fi'; // Agar react-icons installed nahi hai to aap simple SVG ya icons use kar sakte hain

const AdminDashBoard = () => {
  // Mock data for recent orders table
  const recentOrders = [
    { id: '#ORD-9821', customer: 'Ahmad Ali', product: 'Wireless Earbuds', amount: '\$120.00', status: 'Completed' },
    { id: '#ORD-9822', customer: 'Fatima Khan', product: 'Smart Watch Series 7', amount: '\$250.00', status: 'Pending' },
    { id: '#ORD-9823', customer: 'Usman Tariq', product: 'Mechanical Keyboard', amount: '\$85.00', status: 'Completed' },
    { id: '#ORD-9824', customer: 'Ayesha Malik', product: 'Running Shoes', amount: '\$110.00', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans mt-5">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Welcome back, Admin! Here is what's happening with your store today.
            </p>
          </div>
          <div className="flex gap-4">
            <a 
              href="/NewProduct" 
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <FiPlus className="w-5 h-5" />
              Create New Product
            </a>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all duration-200 transform hover:-translate-y-0.5"
            >

              All Products
            </a>
          </div>
        </div>

        {/* Key Metrics / Stats Grid (Total Sales, Total Profit, Orders, Products) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Sales Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Sales</span>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <FiDollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900">\$24,580</h3>
              <span className="text-emerald-600 text-xs font-semibold flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
                <FiArrowUpRight className="w-3 h-3 mr-0.5" /> +12%
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>Monthly: <strong className="text-slate-700">\$4,210</strong></span>
              <span>Yearly: <strong className="text-slate-700">\$24,580</strong></span>
            </div>
          </div>

          {/* Total Profit Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Profit</span>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <FiTrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900">\$9,840</h3>
              <span className="text-emerald-600 text-xs font-semibold flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
                <FiArrowUpRight className="w-3 h-3 mr-0.5" /> +8.4%
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>Monthly: <strong className="text-slate-700">\$1,450</strong></span>
              <span>Yearly: <strong className="text-slate-700">\$9,840</strong></span>
            </div>
          </div>

          {/* Orders Overview Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Orders Status</span>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <FiShoppingBag className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-slate-900">142</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <FiClock className="w-3.5 h-3.5" /> Pending: 18
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <FiCheckCircle className="w-3.5 h-3.5" /> Completed: 124
              </span>
            </div>
          </div>

          {/* Products Management Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Products Catalog</span>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FiBox className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-slate-900">64</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>Active Items: <strong className="text-slate-700">59</strong></span>
              <span>Out of Stock: <strong className="text-rose-600">5</strong></span>
            </div>
          </div>

        </div>

        {/* Secondary Section: Performance Details & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Performance Summary / Analytics Panel */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Performance Details</h3>
              <p className="text-slate-500 text-sm mb-6">Overview of store health and metrics conversions.</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1 font-medium text-slate-700">
                    <span>Conversion Rate</span>
                    <span>3.8%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1 font-medium text-slate-700">
                    <span>Customer Retention</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1 font-medium text-slate-700">
                    <span>Store Traffic Goal</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 bg-indigo-50/50 p-4 rounded-xl">
              <h4 className="font-semibold text-indigo-900 text-sm">💡 Pro Tip</h4>
              <p className="text-xs text-indigo-700 mt-1">
                Updating product descriptions with high-quality keywords can boost conversion rates by up to 15%.
              </p>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
                <p className="text-slate-500 text-sm">Latest transactions from store customers</p>
              </div>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 font-medium text-indigo-600">{order.id}</td>
                      <td className="py-3.5 text-slate-700">{order.customer}</td>
                      <td className="py-3.5 text-slate-600">{order.product}</td>
                      <td className="py-3.5 font-semibold text-slate-900">{order.amount}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashBoard;