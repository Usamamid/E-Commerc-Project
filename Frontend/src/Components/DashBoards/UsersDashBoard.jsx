import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UsersDashBoard = () => {
  const [user, setUser] = useState({ name: "User", email: "user@example.com" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // User details fetch karne ke liye (agar backend par route ho)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/login/checkAuth', {
          withCredentials: true
        });
        if (response.data.isAuthenticated && response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/logout', { withCredentials: true });
      navigate('/Register');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      <div className="max-w-6xl mx-auto p-6 mt-4">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name || "Customer"}! 👋</h1>
            <p className="text-blue-100 mt-1">Manage your pharmacy orders, check items in cart, and explore medicines.</p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 md:mt-0 bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-xl shadow hover:bg-blue-50 transition duration-200"
          >
            Browse Medicines
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Profile Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
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
                className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-between"
              >
                <span>🛒 View Shopping Cart</span>
                <span className="text-blue-600 font-bold">&rarr;</span>
              </button>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium flex items-center justify-between"
              >
                <span>🚪 Logout</span>
              </button>
            </div>
          </div>

          {/* Right Column: Quick Stats & Recent Activity */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Quick Actions / Stats Cards */}
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

            {/* Recent Orders Section (Placeholder) */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
              <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                <p>No recent orders found.</p>
                <button 
                  onClick={() => navigate('/')} 
                  className="mt-3 text-blue-600 font-semibold text-sm underline hover:text-blue-700"
                >
                  Start shopping now
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default UsersDashBoard;