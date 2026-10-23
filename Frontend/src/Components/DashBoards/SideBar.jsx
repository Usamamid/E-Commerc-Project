import React from 'react';
import { useNavigate } from 'react-router-dom';

const SideBar = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    const role = localStorage.getItem('userRole');

    if (role === 'owner') {
      navigate('/AdminDashBoard');
    } else if (role === 'user') {
      navigate('/UsersDashBoard');
    } else {
      alert("Please login first to view the dashboard!");
      navigate('/Register');
    }
  };

  return (
    <div className="w-full md:w-64 bg-white rounded-2xl shadow-md p-5 border border-gray-200 flex flex-col justify-between">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-700 mb-6 px-2">Navigation</h2>

        <button 
          onClick={() => navigate('/Cart')} 
          className="w-full text-left px-4 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition duration-200 flex items-center gap-3"
        >
          <span>🛒</span> Shopping Cart
        </button>

        <button 
          onClick={handleDashboardClick} 
          className="w-full text-left px-4 py-2.5 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold transition duration-200 flex items-center gap-3 shadow-sm"
        >
          <span>📊</span> Dashboard
        </button>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-100">
        {isLoggedIn ? (
          <div className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-2 rounded-lg text-center">
            ● Status: Logged In
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-red-500 font-medium text-center">
              ● No one is logged in
            </div>
            <button 
              onClick={() => navigate('/Register')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition duration-200 text-center"
            >
              Login / Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;