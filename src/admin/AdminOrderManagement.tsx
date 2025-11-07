import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import { useAdminData, getStatusBadge } from './useAdmin';
import AdminLayout from './AdminLayout';

const FilterTab = ({ type, active, onClick }) => (
  <button onClick={onClick}
    className={`px-4 py-2 rounded capitalize ${active ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
    {type} Orders
  </button>
);

const OrderCard = ({ order, onConfirmPayment, onUpdateStatus }) => {
  const STATUS_OPTIONS = ['PAYMENT_CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">Order #{order.id}</h3>
          <p className="text-sm text-gray-600">{order.user.firstName} {order.user.lastName} • {order.user.email}</p>
          <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-blue-600 font-bold text-xl">{formatPrice(order.totalAmount)}</p>
          {order.refundedAmount > 0 && (
            <p className="text-red-600 font-bold">Refunded: {formatPrice(order.refundedAmount)}</p>
          )}
          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
          {getStatusBadge(order.paymentStatus)}
        </div>
      </div>

      {/* Details */}
      <div className="border-t border-gray-200 pt-4 mb-4 text-sm text-gray-600">
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Address:</strong> {order.shippingAddress}</p>
        {order.trackingNumber && <p><strong>Tracking:</strong> {order.trackingNumber}</p>}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Payment Confirmation for Online Payment */}
        {order.paymentMethod !== 'Cash on Delivery' && order.paymentStatus === 'PENDING' && (
          <button onClick={() => onConfirmPayment(order.id)} 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Confirm Payment
          </button>
        )}

        {/* Status Update */}
        {((order.paymentMethod === 'Cash on Delivery') || order.paymentStatus === 'CONFIRMED') &&
          order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
            <select onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              className="border p-2 rounded">
              <option value="">Update Status...</option>
              {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
        )}

        {/* COD Payment Collection */}
        {order.paymentMethod === 'Cash on Delivery' && 
          order.status === 'DELIVERED' && 
          order.paymentStatus === 'PENDING' && (
            <button onClick={() => onConfirmPayment(order.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Confirm COD Payment
            </button>
        )}
      </div>
    </div>
  );
};

export default function AdminOrderManagement() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const { data: orders, loading, reload } = useAdminData(adminAPI.getAllOrders);

  const handleConfirmPayment = async (orderId) => {
    if (!window.confirm('Confirm payment for this order?')) return;
    try {
      await adminAPI.confirmPayment(orderId);
      reload();
    } catch {
      alert('Failed to confirm payment');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    
    let trackingNumber = null;
    if (newStatus === 'SHIPPED') {
      trackingNumber = prompt('Enter tracking number:');
      if (!trackingNumber) return;
    }

    try {
      await adminAPI.updateOrderStatus(orderId, newStatus, trackingNumber);
      reload();
    } catch {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders?.filter(order => {
    if (filter === 'refunded') return order.returnStatus === 'REFUND_COMPLETED';
    if (filter === 'active') 
      return order.status !== 'DELIVERED' && 
             order.status !== 'CANCELLED' && 
             order.returnStatus !== 'REFUND_COMPLETED';
    return true;
  }) || [];

  return (
    <AdminLayout title="Order Management">
      {/* Back to Dashboard Button */}
      <button onClick={() => navigate('/admin-dashboard')}
        className="flex items-center gap-2 text-blue-600 font-medium hover:underline mb-6">
        <ArrowLeft className="w-5 h-5" />Back to Dashboard
      </button>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {['all', 'active', 'refunded'].map(type => (
          <FilterTab key={type} type={type} active={filter === type} onClick={() => setFilter(type)} />
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} 
              onConfirmPayment={handleConfirmPayment}
              onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}