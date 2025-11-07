import { useState } from 'react';
import { ShoppingCart, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authAPI } from '../services/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authAPI.login(formData);

      if (response.data.user.role !== 'ADMIN') {
        setError('❌ Access denied – Admin account required.');
        return;
      }

      login(response.data.user, response.data.token);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingCart className="w-12 h-12 text-white" />
            <span className="text-4xl font-bold text-white">TechMart</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full inline-flex">
            <Lock className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Admin Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-gray-600 text-center mb-8">Access the admin dashboard</p>

          {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <input type="email" name="email" value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@techmart.com" required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" name="password" value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter admin password" required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
              Sign In to Admin Panel
            </button>
          </form>

          <button onClick={() => navigate('/login')} className="mt-6 w-full text-center text-blue-600 hover:text-blue-500 font-semibold text-sm">
            ← Back to Customer Login
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-white text-sm space-y-2">
          <p>🔒 Secure admin access only</p>
          <p>Admin credentials required for dashboard access</p>
        </div>
      </div>
    </div>
  );
}