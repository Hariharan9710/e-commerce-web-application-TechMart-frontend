
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { formatPrice, calculateSubtotal, calculateTax, calculateTotal, getImageUrl } from '../utils/helpers';
import { useApp } from '../context/AppContext';

export default function ShoppingCartPage() {
  const { cartItems, updateQuantity, removeItem } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Link 
            to="/all-products"
            className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        <div className="text-sm text-gray-600 mb-8">
          {cartItems.length} items in your cart
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-16 flex flex-col items-center justify-center min-h-96">
            <ShoppingBag className="w-16 h-16 text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
            <Link
              to="/all-products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow-md p-6 flex gap-6 items-center"
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                    <div className="flex gap-4 text-sm mb-2">
                      <span className="text-gray-600">{item.category}</span>
                      <span className="font-medium">{item.brand}</span>
                    </div>
                    <div className="text-gray-600">{formatPrice(item.price)}</div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col gap-4 items-center">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-medium border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 text-gray-600 text-sm hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>

                  <div className="text-xl font-bold">
                    {formatPrice((+item.price || 0) * (+item.quantity || 0))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium">
                    {formatPrice(calculateSubtotal(cartItems))}
                  </span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm font-medium">Free</span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-600">Tax (18%)</span>
                  <span className="text-sm font-medium">
                    {formatPrice(calculateTax(calculateSubtotal(cartItems)))}
                  </span>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(calculateTotal(cartItems))}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-4 text-center"
                >
                  Proceed to Checkout
                </Link>

                <p className="text-xs text-gray-600 text-center">
                  Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}