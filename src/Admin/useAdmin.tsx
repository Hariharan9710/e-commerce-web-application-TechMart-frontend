import { useState, useEffect } from 'react';

// Reusable data loading hook
export function useAdminData(apiCall, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await apiCall();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, deps);

  return { data, loading, error, reload: loadData };
}

// Status badge generator
export function getStatusBadge(status) {
  const statusConfig = {
    'REQUESTED': { class: 'bg-yellow-100 text-yellow-800', text: '⏳ Awaiting Approval' },
    'APPROVED': { class: 'bg-blue-100 text-blue-800', text: '📦 Awaiting Product' },
    'REJECTED': { class: 'bg-red-100 text-red-800', text: '❌ Rejected' },
    'RETURN_RECEIVED': { class: 'bg-purple-100 text-purple-800', text: '✅ Product Received' },
    'REFUND_INITIATED': { class: 'bg-orange-100 text-orange-800', text: '💰 Refund Processing' },
    'REFUND_COMPLETED': { class: 'bg-green-100 text-green-800', text: '✅ Refund Complete' },
    'RETURN_REJECTED': { class: 'bg-red-100 text-red-800', text: '❌ Return Rejected' },
    'PENDING': { class: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    'CONFIRMED': { class: 'bg-green-100 text-green-800', text: 'Confirmed' },
    'PROCESSING': { class: 'bg-blue-100 text-blue-800', text: 'Processing' },
    'SHIPPED': { class: 'bg-purple-100 text-purple-800', text: 'Shipped' },
    'DELIVERED': { class: 'bg-green-100 text-green-800', text: 'Delivered' }
  };

  const config = statusConfig[status] || { class: 'bg-gray-100 text-gray-800', text: status };
  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>{config.text}</span>;
}