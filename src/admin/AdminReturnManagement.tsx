import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAdminData, getStatusBadge } from './useAdmin';

const Modal = ({ type, value, onChange, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg max-w-md w-full shadow">
      <h3 className="text-xl font-bold mb-4">
        {type === 'reject' ? 'Rejection Reason' : 'Product Condition'}
      </h3>

      {type === 'reject' ? (
        <>
          <textarea value={value} onChange={(e) => onChange(e.target.value)}
            className="w-full border rounded p-3 mb-4" placeholder="Enter reason..." />
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Submit</button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-4">Is the returned item in good condition?</p>
          <div className="flex gap-3">
            <button onClick={() => onConfirm('DAMAGED')} className="px-4 py-2 bg-red-600 text-white rounded">Damaged</button>
            <button onClick={() => onConfirm('GOOD')} className="px-4 py-2 bg-green-600 text-white rounded">Good</button>
          </div>
        </>
      )}
    </div>
  </div>
);

const ReturnCard = ({ order, onApprove, onReject, onReceived, onRefund, onComplete }) => {
  const actionButtons = {
    'REQUESTED': (
      <div className="flex gap-3">
        <button onClick={() => onApprove(order.id)} className="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
        <button onClick={() => onReject(order.id)} className="bg-red-600 text-white px-4 py-2 rounded">Reject</button>
      </div>
    ),
    'APPROVED': (
      <button onClick={() => onReceived(order.id)} className="bg-blue-600 text-white px-4 py-2 w-full rounded">
        Product Received - Check Condition
      </button>
    ),
    'RETURN_RECEIVED': (
      <button onClick={() => onRefund(order.id)} className="bg-orange-600 text-white px-4 py-2 w-full rounded">
        Initiate Refund
      </button>
    ),
    'REFUND_INITIATED': (
      <button onClick={() => onComplete(order.id)} className="bg-green-600 text-white px-4 py-2 w-full rounded">
        Complete Refund
      </button>
    )
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg mb-4">
      <div className="flex justify-between mb-4">
        <div>
          <p className="font-bold">Order #{order.id}</p>
          <p className="text-sm text-gray-600">{order.user.email}</p>
        </div>
        {getStatusBadge(order.returnStatus)}
      </div>
      {actionButtons[order.returnStatus]}
    </div>
  );
};

export default function AdminReturnManagement() {
  const navigate = useNavigate();
  const { data: returns, loading, reload } = useAdminData(adminAPI.getAllReturnRequests);

  const [modal, setModal] = useState({ show: false, type: '', orderId: null, input: '' });

  const handleAction = async (apiCall, orderId, ...args) => {
    try {
      await apiCall(orderId, ...args);
      reload();
    } catch {
      alert('Action failed');
    }
  };

  const handleApprove = (orderId) => {
    if (window.confirm('Approve return? Customer will ship product back.')) {
      handleAction(adminAPI.approveReturn, orderId);
    }
  };

  const handleReject = (orderId) => {
    setModal({ show: true, type: 'reject', orderId, input: '' });
  };

  const confirmReject = () => {
    if (!modal.input.trim()) return alert('Enter reason');
    handleAction(adminAPI.rejectReturn, modal.orderId, modal.input);
    setModal({ show: false, type: '', orderId: null, input: '' });
  };

  const handleReceived = (orderId) => {
    setModal({ show: true, type: 'condition', orderId, input: '' });
  };

  const confirmCondition = (condition) => {
    handleAction(adminAPI.confirmReturnReceived, modal.orderId, condition);
    setModal({ show: false, type: '', orderId: null, input: '' });
  };

  const handleRefund = (orderId) => {
    if (window.confirm('Initiate refund?')) handleAction(adminAPI.initiateRefund, orderId);
  };

  const handleComplete = (orderId) => {
    if (window.confirm('Confirm refund completed?')) handleAction(adminAPI.completeRefund, orderId);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {modal.show && (
        <Modal type={modal.type} value={modal.input} onChange={(val) => setModal(prev => ({ ...prev, input: val }))}
          onConfirm={modal.type === 'reject' ? confirmReject : confirmCondition}
          onCancel={() => setModal({ show: false, type: '', orderId: null, input: '' })} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/admin-dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-5 h-5" />Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-6">Return Requests</h1>

        {returns?.length === 0 ? (
          <p>No return requests found.</p>
        ) : (
          returns?.map(order => (
            <ReturnCard key={order.id} order={order}
              onApprove={handleApprove}
              onReject={handleReject}
              onReceived={handleReceived}
              onRefund={handleRefund}
              onComplete={handleComplete} />
          ))
        )}
      </div>
    </div>
  );
}