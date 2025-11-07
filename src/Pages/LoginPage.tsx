
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useForm } from '../hooks/useForm';
import { handleAPIError } from '../utils/errorHandler';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp(); // ✅ Get login from context

  const { formData, handleChange } = useForm({
    email: '',
    password: '',
    rememberMe: false
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      // ✅ Use AppContext login
      await login(response.data.user, response.data.token);

      // ✅ Redirect after login
      navigate('/');
      
    } catch (err) {
      setError(handleAPIError(err, 'Login failed. Please try again.'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to continue to TechMart</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2">Remember me</span>
            </label>

            <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')} // ✅ Correct page navigation
            className="text-blue-600 hover:text-blue-500 font-semibold"
          >
            Create one here
          </button>
        </div>
      </div>
    </div>
  );
}
