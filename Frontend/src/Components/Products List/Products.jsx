import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import SideBar from '../DashBoards/SideBar';
import axios from 'axios';

const Products = ({ addToCart }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Zoomed Image aur Notification states
  const [selectedImage, setSelectedImage] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/login/checkAuth', {
          withCredentials: true
        });
        if (response.data.isAuthenticated) {
          setIsLoggedIn(true);
          if (response.data.role) {
            localStorage.setItem('userRole', response.data.role);
          }
        }
      } catch (err) {
        setIsLoggedIn(false);
        localStorage.removeItem('userRole');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
    fetchProducts();
  }, []);

  // Handle Add to Cart with feedback message
  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification(`${product.name} cart mein add ho gaya hai! 🛒`);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      {/* Success Notification Banner */}
      {notification && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg z-50 transition duration-300">
          {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto mt-4">
        <h1 className="text-xl font-bold mb-4">Products Page:-</h1>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-64 shrink-0">
            <SideBar isLoggedIn={isLoggedIn} />
          </div>

          <div className="flex-1">
            {loading ? (
              <p className="text-gray-600">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-500">No products available right now.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div 
                    key={product._id} 
                    className="bg-white rounded-xl shadow-md p-4 border border-gray-200 flex flex-col justify-between"
                  >
                    {/* Image Container with Click to Zoom */}
                    <div 
                      onClick={() => product.image && setSelectedImage(product.image)}
                      className="w-full h-40 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden cursor-pointer group relative"
                    >
                      {product.image ? (
                        <>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-contain group-hover:scale-105 transition duration-200" 
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center text-white text-xs font-semibold">
                            🔍 Click to Zoom
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <p className="font-semibold text-gray-800 truncate" title={product.name}>
                        {product.name}
                      </p>
                      <p className="text-blue-600 font-bold">
                        \${product.price}
                      </p>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(product)} 
                      type="button" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal Overlay */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)} 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-gray-900/70 hover:bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer"
            >
              ✕
            </button>
            <img 
              src={selectedImage} 
              alt="Zoomed Product" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;