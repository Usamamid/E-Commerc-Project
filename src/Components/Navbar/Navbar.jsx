import React from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white p-4 mt-2 h-15 flex items-center justify-between">
      <div className="flex items-center gap-4 justify-between w-full">
        <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">NH-U Store</h2>
        <div className="w-13 h-13 bg-gray-200 rounded-full flex items-center justify-center">
          <img src="https://cdn.vectorstock.com/i/1000v/27/60/medical-pharmacy-logo-design-template-vector-35392760.jpg" alt="Logo" className="w-full h-full object-center rounded-[20%]" />
        </div>
        </div>
        <div className="flex items-center gap-4 justify-end text-xl">
        <Link to="/cart">
          Cart
        </Link>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <input type="text" placeholder="Search..." className="bg-gray-700 text-white placeholder:text-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"></input>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600">
              <button>
              <Search />
              </button>
            </div>
        </div>
      </div>
    </div>

  )
}

export default Navbar
