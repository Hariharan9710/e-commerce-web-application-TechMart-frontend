import { useState } from 'react';
import { Package, Users, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { useAdminData } from './useAdmin';
import { adminAPI } from '../services/api';
import AdminLayout from './AdminLayout';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`bg-${color}-100 p-3 rounded-lg`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <TrendingUp className="w-5 h-5 text-green-500" />
    </div>
    <h3 className="text-gray-600 text-sm mb-1">{label}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const ActionCard = ({ icon: Icon, title, subtitle, onClick, color = 'blue' }) => (
  <button onClick={onClick} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left">
    <Icon className={`w-8 h-8 text-${color}-600 mb-2`} />
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-gray-600 text-sm">{subtitle}</p>
  </button>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: dashboardData, loading } = useAdminData(adminAPI.getDashboard);
  const { data: stockSummary } = useAdminData(adminAPI.getStockSummary);

  if (loading) return <AdminLayout><p>Loading dashboard...</p></AdminLayout>;

  const stats = [
    { icon: Package, label: 'Total Products', value: dashboardData?.totalProducts || 0, color: 'blue' },
    { icon: Package, label: 'Total Orders', value: dashboardData?.totalOrders || 0, color: 'green' },
    { icon: Users, label: 'Total Users', value: dashboardData?.totalUsers || 0, color: 'purple' },
    { icon: DollarSign, label: 'Total Revenue', value: formatPrice(dashboardData?.totalRevenue || 0), color: 'yellow' }
  ];

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Manage your store inventory and monitor sales">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ActionCard icon={Package} title="Manage Orders" subtitle="View and update order status" onClick={() => navigate('/admin-orders')} />
        <ActionCard icon={Package} title="Return Requests" subtitle="Review and process returns" onClick={() => navigate('/admin-returns')} color="orange" />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b border-gray-200">
          {['overview', 'products'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
              {tab === 'overview' ? 'Stock Overview' : 'Product Management'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'overview' ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Stock Summary by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stockSummary?.map(cat => (
                <div key={cat.category} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">{cat.category}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Stock:</span>
                      <span className="font-semibold text-xl">{cat.totalStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-semibold">{cat.productCount}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate('/admin-products', { state: { category: cat.category } })}
                    className="mt-4 w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <button onClick={() => navigate('/admin-products')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <Plus className="w-5 h-5" />Add New Product
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockSummary?.map(cat => (
                <button key={cat.category} onClick={() => navigate('/admin-products', { state: { category: cat.category } })}
                  className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:bg-blue-50 transition text-left">
                  <h3 className="text-lg font-bold mb-2">{cat.category}</h3>
                  <p className="text-sm text-gray-600">{cat.productCount} products</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}