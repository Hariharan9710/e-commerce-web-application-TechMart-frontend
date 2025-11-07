
import { API_ENDPOINTS, APP_CONFIG } from '../config/config';

export const formatPrice = (price) => `₹${(price ?? 0).toLocaleString('en-IN')}`;

export const calculateSubtotal = (cartItems) => {
  return cartItems.reduce((sum, item) => 
    sum + ((item.price || 0) * (item.quantity || 0)), 0
  );
};

export const calculateTax = (subtotal, rate = APP_CONFIG.taxRate) => {
  return subtotal * rate;
};

export const calculateTotal = (cartItems) => {
  const subtotal = calculateSubtotal(cartItems);
  return subtotal + calculateTax(subtotal);
};

export const getTotalQuantity = (cartItems) => {
  if (!cartItems || cartItems.length === 0) return 0;
  return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

// Image URL helper
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_ENDPOINTS.images}/${imagePath.replace(/^\/+/, '')}`;
};

// Date helpers
export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isWithinDays = (date, days) => {
  if (!date) return false;
  const targetDate = new Date(date);
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  return targetDate >= daysAgo;
};
