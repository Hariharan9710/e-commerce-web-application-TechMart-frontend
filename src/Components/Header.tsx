import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, LogOut, HelpCircle, Shield, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTotalQuantity } from '../utils/helpers';

interface HeaderProps {
  showSearch?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Header({ showSearch = false, searchQuery = '', setSearchQuery }: HeaderProps) {
  const navigate = useNavigate();
  const { cartItems, isLoggedIn, user, logout } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-600">TechMart</span>
        </Link>

        {/* Search Bar */}
        {showSearch && setSearchQuery ? (
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
            />
          </div>
        ) : (
          <div className="flex-1 max-w-2xl flex border-2 border-gray-300 rounded-lg overflow-hidden">
            <input 
              type="text" 
              placeholder="Search electronics..." 
              className="flex-1 px-4 py-2 outline-none" 
            />
            <button className="bg-blue-600 text-white px-6 py-2 font-semibold">
              Search
            </button>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {getTotalQuantity(cartItems) > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {getTotalQuantity(cartItems)}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {isLoggedIn ? (
            <div className="relative">
              <Menu 
                className="w-6 h-6 text-gray-700 cursor-pointer" 
                onClick={() => setShowMenu(!showMenu)} 
              />
              
              {showMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 w-64 py-2 z-50">
                  
                  {/* User Info */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                        <Shield className="w-3 h-3" />Administrator
                      </span>
                    )}
                  </div>

                  {/* Admin Link */}
                  {isAdmin && (
                    <>
                      <Link 
                        to="/admin-dashboard"
                        onClick={() => setShowMenu(false)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-3 text-blue-600 font-medium"
                      >
                        <Shield className="w-4 h-4" />Admin Dashboard
                      </Link>
                      <div className="border-t border-gray-100 my-2"></div>
                    </>
                  )}

                  {/* Menu Items */}
                  <Link to="/profile" onClick={() => setShowMenu(false)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                    <User className="w-4 h-4" />Your Account
                  </Link>
                  
                  <Link to="/cart" onClick={() => setShowMenu(false)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4" />Cart
                  </Link>
                  
                  <Link to="/orders" onClick={() => setShowMenu(false)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                    <Package className="w-4 h-4" />My Orders
                  </Link>
                  
                  <Link to="/customer-help" onClick={() => setShowMenu(false)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                    <HelpCircle className="w-4 h-4" />Customer Help
                  </Link>

                  {/* Logout */}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button 
                      onClick={() => { logout(); setShowMenu(false); navigate('/'); }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
