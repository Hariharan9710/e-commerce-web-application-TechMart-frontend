import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Page imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AllProductsPage from './pages/AllProductsPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import CustomerHelpPage from './pages/CustomerHelpPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// Admin imports
import AdminLoginPage from './admin/AdminLoginPage';
import AdminDashboard from './admin/AdminDashboard';
import AdminProductManagement from './admin/AdminProductManagement';
import AdminOrderManagement from './admin/AdminOrderManagement';
import AdminReturnManagement from './admin/AdminReturnManagement';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/all-products" element={<AllProductsPage />} />
        <Route path="/category/products" element={<CategoryProductsPage />} />
        {/* <Route path="/product-detail" element={<ProductDetailPage />} /> */}
        <Route path="/product-detail/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/customer-help" element={<CustomerHelpPage />} />
        
        {/* Protected Routes */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin-products" element={<ProtectedRoute adminOnly><AdminProductManagement /></ProtectedRoute>} />
        <Route path="/admin-orders" element={<ProtectedRoute adminOnly><AdminOrderManagement /></ProtectedRoute>} />
        <Route path="/admin-returns" element={<ProtectedRoute adminOnly><AdminReturnManagement /></ProtectedRoute>} />
      </Routes>
    </AppProvider>
  );
}

export default App;