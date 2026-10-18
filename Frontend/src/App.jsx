import React, { useState, useEffect } from 'react';
import Cart from './Components/Cart/Cart';
import { Route, Routes } from 'react-router-dom';
import Products from './Components/Products List/Products';
import NewProduct from './Components/CreateNewProducts/NewProduct';
import AdminDashBoard from './Components/DashBoards/AdminDashBoard';
import Register from './Components/Register/Register';
import ProductRegister from './Components/Register/ProductRegister';
import UsersDashBoard from './Components/DashBoards/UsersDashBoard'

const App = () => {
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return []; // Agar localstorage mein koi error ho toh empty array return kare
    }
  });
  
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Safe Add to Cart function with product check
  const addToCart = (product) => {
    if (!product) return; // Agar product undefined ho toh yahin rok dein

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item && item._id === product._id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item && item._id === product._id 
            ? { ...item, Quantity: Number(item.Quantity || 1) + 1 } 
            : item
        );
      } else {
        return [...prevCart, { 
          ...product, 
          price: Number(product.price) || 0, 
          Quantity: 1 
        }];
      }
    });
  };

  return (
    <div className="w-full h-full bg-gray-300">
        <Routes>
          <Route path='/' element={<Products cart={cart} setCart={setCart} addToCart={addToCart} search={search} setSearch={setSearch}/>}/>
          <Route path='/Cart' element={<Cart cart={cart} setCart={setCart} />}/>
          <Route path='/Register' element={<Register cart={cart} setCart={setCart} />}/>
          <Route path='/NewProduct' element={<NewProduct cart={cart} setCart={setCart} search={search} setSearch={setSearch}/>}/>
          <Route path='/AdminDashBoard' element={<AdminDashBoard cart={cart} setCart={setCart} search={search} setSearch={setSearch}/>}/>
          <Route path='/ProductRegister' element={<ProductRegister cart={cart} setCart={setCart} search={search} setSearch={setSearch}/>}/>
          <Route path='/UsersDashBoard' element={<UsersDashBoard cart={cart} setCart={setCart} search={search} setSearch={setSearch}/>}/>
        </Routes>
    </div>
  );
};

export default App;