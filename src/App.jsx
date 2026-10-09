import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Cart from './Components/Cart/Cart'
import { Route, Routes } from 'react-router-dom'
import { useState,useEffect } from 'react'
import Products from './Components/Products List/Products'
import NewProduct from './Components/CreateNewProducts/NewProduct'
import AdminDashBoard from './Components/DashBoards/AdminDashBoard'

const App = () => {

  const [cart, setCart] = useState(()=>{
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [search, setSearch] = useState("");
  
  useEffect(()=>{
    localStorage.setItem("cart", JSON.stringify(cart));
  },[cart])

  return (

    <div className="w-full h-full bg-gray-300">
        <Routes>
          <Route path='/Cart' element={<Cart cart={cart} setCart={setCart} />}/>
          <Route path='/' element={<Products cart={cart} setCart={setCart} search={search} setSearch={setSearch}/>}/>
          <Route path='/NewProduct' element={<NewProduct cart={cart} setCart={setCart} search={search} setSearch={setSearch}/>}/>
          <Route path='/AdminDashBoard' element={<AdminDashBoard cart={cart} setCart={setCart} search={search} setSearch={setSearch}/>}/>
        </Routes>
    </div>
  )
}

export default App