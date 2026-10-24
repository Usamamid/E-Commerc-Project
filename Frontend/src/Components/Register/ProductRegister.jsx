import React, { useState } from 'react';
import API from "../../services/api";
const ProductRegister = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(''); 
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('image', image);
    data.append('name', name);
    data.append('price', price);
    data.append('stock', stock); 

    try {
      const response = await API.post('/products/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("✅ Product Created Successfully!");
      console.log(response.data);

      setName('');
      setPrice('');
      setStock(''); 
      setImage(null);
      setImagePreview(null);

    } catch (err) {
      console.error(err);
      alert("❌ Failed to create product!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 border border-gray-100">
        
        <div className="border-b pb-4 mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Add New Medicine</h2>
          <a href="/AdminDashBoard" className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-200 transition">
            Admin Panel
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 relative">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <span className="text-xs text-gray-500 block">Click to upload image</span>
                </div>
              )}
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={handleImageChange} 
                required 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input 
              type="text" 
              placeholder="e.g. Tab Panadol 500mg" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input 
              type="number" 
              placeholder="120" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock / Quantity</label>
            <input 
              type="number" 
              placeholder="50" 
              value={stock} 
              onChange={(e) => setStock(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md cursor-pointer"
          >
            Create Product
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProductRegister;