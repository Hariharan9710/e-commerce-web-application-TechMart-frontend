import { ShoppingCart, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AdminLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const { user, logout } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <div>
              <span className="text-2xl font-bold text-blue-600">TechMart</span>
              <span className="ml-2 text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-600">Administrator</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}