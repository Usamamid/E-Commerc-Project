import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import axios from 'axios';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const setHandleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/login/logout', { withCredentials: true });
      setIsLoggedIn(false);
      localStorage.removeItem('userRole');
      alert("Logout Successfully!");
      navigate('/Register');
    } catch (err) {
      console.log("Logout error:", err);
      alert("Logout failed!");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 mt-2 h-16 flex items-center justify-between rounded-xl shadow-md">
      <div className="flex items-center gap-4 justify-between w-full">
        
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <h2 className="text-xl font-bold">NH-U Store</h2>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="https://cdn.vectorstock.com/i/1000v/27/60/medical-pharmacy-logo-design-template-vector-35392760.jpg" 
              alt="Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-lg font-medium">
          <Link to="/Cart" className="hover:text-blue-400 transition">
            🛒 Cart
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search medicines..." 
            className="bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition">
            <button className="flex items-center justify-center text-white">
              <Search size={18} />
            </button>
          </div>
        </div>

        <div>
          <button 
            onClick={() => {
              if (isLoggedIn) {
                setHandleLogout();
              } else {
                navigate('/Register');
              }
            }}
            className={`py-2 px-5 rounded-xl font-semibold text-white cursor-pointer transition duration-200 ${
              isLoggedIn ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;