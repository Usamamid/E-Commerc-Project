import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

// Coupons object sirf ek dafa component ke bahar define hoga
const Coupons = {
  "SAVE5": 5,
  "FLAT10": 10,
  "EID8": 8,
  "WELCOME20": 20
};

const Cart = ({ cart, setCart }) => {
  const [couponCode, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  // Fixed to use _id instead of id
  const increaseQty = (_id) => {
    const newCart = cart.map((item) => {
      if (item._id === _id) {
        return {
          ...item,
          Quantity: Number(item.Quantity) + 1
        };
      }
      return item;
    });
    setCart(newCart);
  };

  const decreaseQty = (_id) => {
    const newCart = cart.map((item) => {
      if (item._id === _id) {
        return {
          ...item,
          Quantity: Number(item.Quantity) > 1 ? Number(item.Quantity) - 1 : 1
        };
      }
      return item;
    });
    setCart(newCart);
  };

  const subtotal = cart.reduce((total, item) => {
    return total + Number(item.price) * Number(item.Quantity);
  }, 0);

  const deliveryCharges = subtotal < 1000 && subtotal > 0 ? 200 : 0;

  useEffect(() => {
    const upperCoupon = couponCode ? couponCode.toUpperCase() : "";
    if (Coupons[upperCoupon]) {
      const discountPercent = Coupons[upperCoupon];
      setDiscount((subtotal * discountPercent) / 100);
    } else {
      setDiscount(0);
    }
  }, [couponCode, subtotal]);

  const GrandTotal = Number(subtotal) + Number(deliveryCharges) - Number(discount);
  const isDeliveryChargesApplicable = deliveryCharges > 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />
      <button onClick={() => navigate("/")} className="text-blue-700 absolute top-1 left-2 text-sm">
        Back To Home
      </button>
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Shopping Cart
      </h1>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-5 shadow-gray-600">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 hover:text-gray-700 transition-colors duration-300">
              <img className="w-40 h-40 mx-auto" src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" />
              <br/><br/><br/>
              <h1 className="font-bold text-blue-700">Your cart is empty!</h1>
              <p className="font-sm mt-5">Looks like you haven't added anything to your cart yet.</p>
              <button onClick={() => navigate("/")} className="text-blue-700 underline mt-2">
                [continue shopping]
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover border"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-green-600 font-bold">${item.price}</p>
                  </div>
                </div>

                {/* Quantity & Delete Controls */}
                <div className="flex items-center gap-3">
                  <button onClick={() => decreaseQty(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    -
                  </button>
                  <span className="font-bold text-lg">{item.Quantity}</span>
                  <button onClick={() => increaseQty(item._id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                    +
                  </button>
                  <button onClick={() => setCart(cart.filter((filterItem) => filterItem._id !== item._id))} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill Section */}
        <div className="bg-white rounded-xl shadow-lg p-5 h-fit shadow-gray-600">
          <h2 className="text-2xl font-bold mb-5 text-center">Bill Summary</h2>

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>

          <div className="flex justify-between gap-4 mb-3">
            <div className="flex flex-wrap">
              <span>Delivery</span>
              {isDeliveryChargesApplicable && (
                <p className="text-red-500 text-xs">Order is less than $1000. Delivery charges added. <br/>${1000 - subtotal} more for free delivery.</p>
              )}
              {!isDeliveryChargesApplicable && subtotal >= 1000 && (
                <p className="text-green-600 text-xs">Congratulations! You have Free Delivery.</p>
              )}
            </div>
            <span>${deliveryCharges}</span>
          </div>

          <hr className="my-3" />
          <div className="flex justify-between mb-3 items-center">
            <div>
              <span>Discount</span>
              {discount > 0 && <p className="text-green-500 text-xs">Coupon Applied</p>}
              {couponCode && discount === 0 && <p className="text-red-500 text-xs">Invalid Coupon!</p>}
            </div>
            <input 
              className="h-8 w-3/6 pl-2 border-2 bg-gray-100 rounded text-sm" 
              value={couponCode} 
              onChange={(e) => setCoupon(e.target.value)} 
              type="text" 
              placeholder="Coupon Code"
            />
          </div>

          <div className="flex justify-between text-xl font-bold mt-4">
            <span>Grand Total</span>
            <span>${GrandTotal}</span>
          </div>

          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200">
            Confirm Order
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;