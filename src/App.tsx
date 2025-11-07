import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Page imports
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import AllProductsPage from './Pages/AllProductsPage';
import CategoryProductsPage from './Pages/CategoryProductsPage';
import ProductDetailPage from './Pages/ProductDetailPage';
import ShoppingCartPage from './Pages/ShoppingCartPage';
import CheckoutPage from './Pages/CheckoutPage';
import ProfilePage from './Pages/ProfilePage';
import CustomerHelpPage from './Pages/CustomerHelpPage';
import OrderHistoryPage from './Pages/OrderHistoryPage';

// Admin imports
import AdminLoginPage from './Admin/AdminLoginPage';
import AdminDashboard from './Admin/AdminDashboard';
import AdminProductManagement from './Admin/AdminProductManagement';
import AdminOrderManagement from './Admin/AdminOrderManagement';
import AdminReturnManagement from './Admin/AdminReturnManagement';

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