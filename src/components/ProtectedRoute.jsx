import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, user } = useApp();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/admin-login" />;
  }

  return children;
}
