import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import {
  formatPrice,
  calculateSubtotal,
  calculateTax,
  calculateTotal
} from '../utils/helpers';

export default function CheckoutPage() {
  const { cartItems, user, setCartItems } = useApp();

  const [shippingInfo, setShippingInfo] = useState({
    street: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = async () => {
    if (!shippingInfo.street || !shippingInfo.state || !shippingInfo.zipCode) {
      alert('Please fill in all shipping details');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const orderData = {
        shippingAddress: `${shippingInfo.street}, ${shippingInfo.state}, ${shippingInfo.zipCode}, ${shippingInfo.country}`,
        paymentMethod,
        totalAmount: calculateTotal(cartItems)
      };

      // ✅ Place order
      await axios.post('http://localhost:8080/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Clear cart in backend
      await axios.delete(`http://localhost:8080/api/cart/clear?email=${user.email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Clear cart in context
      setCartItems([]);

      alert('Order placed successfully!');
      setOrderPlaced(true);

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  // ✅ Redirect after order placement
  if (orderPlaced) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header automatically handles user/cart */}
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>

          {/* ✅ Added Back to Cart Link */}
          <Link
            to="/cart"
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to Cart
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* ✔ Order Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            {cartItems.length === 0 ? (
              <div className="text-gray-600 py-4">Your cart is empty</div>
            ) : (
              <div className="space-y-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}

                <div className="border-t pt-3 mt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(calculateSubtotal(cartItems))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>{formatPrice(calculateTax(calculateSubtotal(cartItems)))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      {formatPrice(calculateTotal(cartItems))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ✔ Shipping & Payment */}
          <div className="border-t pt-6 mb-8"></div>

          <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>

          <div className="space-y-4">
            <input
              type="text"
              value={shippingInfo.street}
              onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
              className="w-full input"
              placeholder="Street Address"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={shippingInfo.state}
                onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                className="input"
                placeholder="State"
              />
              <input
                type="text"
                value={shippingInfo.zipCode}
                onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                className="input"
                placeholder="Zip Code"
              />
            </div>

            <select
              value={shippingInfo.country}
              onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
              className="input"
            >
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input"
            >
              <option>Cash on Delivery</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
            </select>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0}
            className="w-full bg-blue-600 text-white py-4 mt-8 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            Place Order
          </button>
        </div>
      </main>
    </div>
  );
}
