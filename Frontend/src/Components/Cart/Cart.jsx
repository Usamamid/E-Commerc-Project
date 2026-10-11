import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
const Cart = ({ cart, setCart }) => {

  
  const [couponCode, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const Coupons={
    "SAVE5":5,
    "FLAT10":10,
    "EID8":8,
    "WELCOME20":20
  }

  const increaseQty = (id) => {
  const newCart = cart.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        Quantity: item.Quantity + 1
      };
    }

    return item;
  });

  setCart(newCart);
};
  const decreaseQty = (id) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          Quantity: item.Quantity > 1
          ? item.Quantity - 1
  : 1
        };
      }

      return item;
    });

    setCart(newCart);
  }
  

  const subtotal = cart.reduce((total, item) => {
  return total + item.price * item.Quantity;
  
}, 0);
  const deliveryCharges=subtotal<1000 && subtotal>0?200:0;
  useEffect(()=>{
    if(Coupons[couponCode.toUpperCase()]){
      const discountPercent=Coupons[couponCode.toUpperCase()];
      setDiscount((subtotal*discountPercent)/100)
    }else{setDiscount(0)}
  },[couponCode,subtotal])
  const GrandTotal=subtotal+deliveryCharges-discount;
  const isDeliveryChargesApplicable=deliveryCharges>0;


  const navigate = useNavigate();


  

  return (
    
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />
      <button onClick={() => navigate("/")} className="text-blue-700 absolute top-1 left-2 text-sm  ">Back To Home</button>
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Shopping Cart
      </h1>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-5 shadow-gray-600 ">

          {cart.length === 0 ? (
            <div className="text-center text-gray-500 hover:text-gray-700 transition-colors duration-300 box-border">
              <img className="w-40 h-40 mx-auto" src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" />
              <br/>
              <br/>
              <br/>
              <h1 className="font-bold text-blue-700 " >Your cart is empty!</h1>
              <p className="font-sm mt-5" >Looks like you haven't added anything to your cart yet.</p>
              <h4 className="text-blue-700 underline" >[continue shopping]</h4>
            </div>
            
          ) : (
            cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex gap-4 items-center">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover border"
                  />

                  <div>
                    <h2 className="text-xl font-semibold">
                      {item.name}
                    </h2>

                    <p className="text-green-600 font-bold">
                      Rs. {item.price}
                    </p>
                  </div>

                </div>

                {/* Future Quantity Buttons */}
                <div className="flex items-center gap-3">

                  <button onClick={() => decreaseQty(item.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    -
                  </button>

                  <span className="font-bold text-lg">
                    {item.Quantity}
                  </span>

                  <button onClick={() => increaseQty(item.id)}  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                    +
                  </button>
                  <button onClick={() => setCart(cart.filter((filterItem) => filterItem.id !== item.id))} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

        {/* Bill Section */}
        <div className="bg-white rounded-xl shadow-lg p-5 h-100 w-100 shadow-gray-600">

          <h2 className="text-2xl font-bold mb-5 text-center">
            Bill Summary
          </h2>

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>

          <div className="flex justify-between gap-4">
            <div className="flex flex-wrap " >
            <span>Delivery</span>
            {isDeliveryChargesApplicable && (<p className="text-red-500" >Order is less then Rs.1000 thats Why Delivery Chagrges is Added <br/> Rs.{1000-subtotal} Add More For Free Delivery</p>)}
            {!isDeliveryChargesApplicable && subtotal>=1000 && (<p className="text-green-600">Congratulation! Now You would Avail Free Delivery</p>)}
            </div>
            <span>Rs.{deliveryCharges}</span>
          </div>


          <hr className="my-3" />
          <div className="flex justify-between mb-3 ">
            <div>
            <span>Discount</span>
            {discount>0 && <p className="text-green-500" > Coupon is SucessFull</p>}
            {couponCode && discount===0 && <p className="text-red-500" >Coupon is Invalid!</p>}
            </div>


            <input className="h-8 w-3/6 pl-2 border-2 bg-gray-300 " value={couponCode} onChange={(e)=>setCoupon(e.target.value)} type="text" placeholder="Write Coupon No"></input>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Grand Total</span>
            <span>Rs. {GrandTotal}</span>
          </div>

          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
            Confirm Order
          </button>

        </div>

      </div>

    </div>
  );
};

export default Cart;