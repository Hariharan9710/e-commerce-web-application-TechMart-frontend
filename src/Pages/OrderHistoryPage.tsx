
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import Header from '../components/Header';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/Helpers';
import { useApp } from '../context/AppContext';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { user } = useApp(); // ✅ (Future use if we need email filtering)

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Return Modal States
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnDetails, setReturnDetails] = useState('');

  const returnReasons = [
    'Wrong item received',
    'Damaged product',
    'Not working properly',
    'Change of mind',
    'Other'
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      await orderAPI.cancelOrder(orderId, reason);
      alert('Order cancelled successfully');
      loadOrders();
    } catch (error) {
      alert(error.response?.data || 'Cannot cancel this order');
    }
  };

  const isWithin15Days = (deliveredAt) => {
    if (!deliveredAt) return false;
    const deliveryDate = new Date(deliveredAt);
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    return deliveryDate >= fifteenDaysAgo;
  };

  const openReturnModal = (order) => {
    setSelectedOrderForReturn(order);
    setReturnReason('');
    setReturnDetails('');
    setShowReturnModal(true);
  };

  const submitReturnRequest = async () => {
    if (!returnReason) {
      alert('Please select a reason');
      return;
    }

    try {
      await orderAPI.requestReturn(
        selectedOrderForReturn.id,
        `${returnReason}${returnDetails ? ': ' + returnDetails : ''}`
      );
      alert('✅ Return request submitted successfully!');
      setShowReturnModal(false);
      loadOrders();
    } catch (error) {
      alert(error.response?.data || 'Failed to submit return request');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ORDER_PLACED': return <Package className="w-5 h-5 text-blue-600" />;
      case 'PAYMENT_PENDING': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'PAYMENT_CONFIRMED': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PROCESSING': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'SHIPPED': return <Truck className="w-5 h-5 text-purple-600" />;
      case 'OUT_FOR_DELIVERY': return <Truck className="w-5 h-5 text-orange-600" />;
      case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY': return 'bg-purple-100 text-purple-800';
      case 'PAYMENT_CONFIRMED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header now reads context automatically */}
      <Header />

      {/* ✅ Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">Request Return</h2>

            <label className="text-sm font-medium">Reason for return</label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Select reason...</option>
              {returnReasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <label className="text-sm font-medium">Additional details (optional)</label>
            <textarea
              value={returnDetails}
              onChange={(e) => setReturnDetails(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              rows="3"
            />

            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={submitReturnRequest} className="px-4 py-2 bg-orange-600 text-white rounded">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        {loading ? (
          <div className="text-center py-20">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-16 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <button
              onClick={() => navigate('/all-products')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">

                {/* ✅ Everything from here stays unchanged */}
                {/* Status Display */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-600">Payment Method:</span> <span className="font-medium">{order.paymentMethod}</span></div>
                    <div><span className="text-gray-600">Payment Status:</span> <span className={`font-medium ${order.paymentStatus === 'CONFIRMED' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span></div>
                    <div><span className="text-gray-600">Total Amount:</span> <span className="font-bold text-blue-600">{formatPrice(order.totalAmount)}</span></div>
                    {order.trackingNumber && (
                      <div><span className="text-gray-600">Tracking:</span> <span className="font-medium">{order.trackingNumber}</span></div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Return Request Button */}
                {order.status === 'DELIVERED' && !order.returnStatus && (
                  <button
                    onClick={() => openReturnModal(order)}
                    className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                    disabled={!isWithin15Days(order.deliveredAt)}
                  >
                    {isWithin15Days(order.deliveredAt) ? 'Request Return' : 'Return Period Expired'}
                  </button>
                )}

                {/* Show Return Status */}
                {order.returnStatus && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium">Return Status: {order.returnStatus}</p>
                    {order.returnReason && <p className="text-xs text-gray-600">Reason: {order.returnReason}</p>}
                    {order.returnRejectionReason && (
                      <p className="text-xs text-red-600">Rejection: {order.returnRejectionReason}</p>
                    )}
                  </div>
                )}

                {/* Cancel Order */}
                {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
