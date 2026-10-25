import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../../services/api";

const UsersDashBoard = () => {
  const [user, setUser] = useState({ name: "User", email: "user@example.com" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      try {
        let currentUserId = localStorage.getItem("userId");
        try {
          const authResponse = await API.get('/login/checkAuth');

          if (authResponse.data.isAuthenticated && authResponse.data.user) {
            setUser(authResponse.data.user);
            if (authResponse.data.userId || authResponse.data.user._id) {
              currentUserId = authResponse.data.userId || authResponse.data.user._id;
            }
          }
        } catch (authErr) {
          console.warn("CheckAuth failed or unauthorized, falling back to localStorage userId:", currentUserId, authErr);
        }

        if (currentUserId) {
          const ordersResponse = await API.get(`/order/user/${currentUserId}`);
          if (ordersResponse.data.success) {
            setOrders(ordersResponse.data.orders);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndOrders();
  }, []);

  const handleLogout = async () => {
    try {
      await API.get('/logout');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      navigate('/Register');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <div className="max-w-6xl mx-auto p-6 mt-4">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name || "Customer"}! 👋</h1>
            <p className="text-blue-100 mt-1">Manage your pharmacy orders, check items in cart, and explore medicines.</p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 md:mt-0 bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-xl shadow hover:bg-blue-50 transition duration-200 cursor-pointer"
          >
            Browse Medicines
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Profile Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 font-bold text-3xl rounded-full flex items-center justify-center mb-4">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{user.email}</p>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                Active Customer
              </span>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="space-y-3">
              <button 
                onClick={() => navigate('/Cart')} 
                className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-between cursor-pointer"
              >
                <span>🛒 View Shopping Cart</span>
                <span className="text-blue-600 font-bold">&rarr;</span>
              </button>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium flex items-center justify-between cursor-pointer"
              >
                <span>🚪 Logout</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => navigate('/')} 
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition duration-200"
              >
                <div className="text-blue-600 text-2xl mb-2">💊</div>
                <h3 className="font-bold text-lg text-gray-800">Order Medicines</h3>
                <p className="text-gray-500 text-sm">Explore our wide range of available healthcare products.</p>
              </div>

              <div 
                onClick={() => navigate('/Cart')} 
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition duration-200"
              >
                <div className="text-indigo-600 text-2xl mb-2">🛍️</div>
                <h3 className="font-bold text-lg text-gray-800">My Cart</h3>
                <p className="text-gray-500 text-sm">Review selected items, apply coupons, and checkout.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>

              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                  <p>No recent orders found.</p>
                  <button 
                    onClick={() => navigate('/')} 
                    className="mt-3 text-blue-600 font-semibold text-sm underline hover:text-blue-700 cursor-pointer"
                  >
                    Start shopping now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3 border-b pb-2 flex-wrap gap-2">
                        <div>
                          <span className="text-gray-500 text-xs">Order ID: </span>
                          <span className="font-mono text-xs font-semibold text-gray-700">{order._id}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-xs">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ""}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {order.status || "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 font-medium">
                              {item.name} <span className="text-gray-400 text-xs">(x{item.quantity})</span>
                            </span>
                            <span className="text-gray-600 font-semibold">${item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t font-bold text-sm">
                        <span className="text-gray-700">Total Amount:</span>
                        <span className="text-blue-600 font-bold">${order.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default UsersDashBoard;