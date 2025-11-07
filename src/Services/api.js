import axios from 'axios';
import { API_ENDPOINTS } from '../config/config';

const api = axios.create({
  baseURL: API_ENDPOINTS.api,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// REVIEWS
export const reviewAPI = {
  addReview: (productId, data) => api.post(`/reviews/product/${productId}`, data),
  getReviewsByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
};

// PRODUCTS
export const productAPI = {
  getAllProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
  getFeaturedProducts: () => api.get('/products/featured'),
};

// CART
export const cartAPI = {
  getCart: (email) => api.get(`/cart?email=${email}`),
  addToCart: (email, productId, quantity) =>
    api.post(`/cart/add?email=${email}&productId=${productId}&quantity=${quantity}`),
  updateCart: (email, cartItemId, quantity) =>
    api.put(`/cart/update/${cartItemId}?email=${email}&quantity=${quantity}`),
  removeFromCart: (email, cartItemId) =>
    api.delete(`/cart/remove/${cartItemId}?email=${email}`),
  mergeCart: (email, cartItems) => api.post(`/cart/merge?email=${email}`, cartItems),
};

// ORDERS
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (orderId, reason) =>
    api.put(`/orders/${orderId}/cancel?reason=${encodeURIComponent(reason)}`),
  requestReturn: (orderId, reason) =>
    api.put(`/orders/${orderId}/request-return`, null, { params: { reason } }),
};

// USER
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// ADMIN
export const adminAPI = {
  // Products
  addProduct: (formData) =>
    api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProduct: (id, formData) =>
    api.put(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Stock
  getStockSummary: () => api.get('/admin/stock/summary'),
  getStockByCategory: (category) => api.get(`/admin/stock/category/${category}`),
  updateStock: (productId, stock) => api.put(`/admin/stock/${productId}?stock=${stock}`),
  
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  getAllOrders: () => api.get('/admin/orders'),
  getAllUsers: () => api.get('/admin/users'),
  
  // Orders
  confirmPayment: (orderId) => api.put(`/admin/orders/${orderId}/confirm-payment`),
  updateOrderStatus: (orderId, status, trackingNumber = null) =>
    api.put(`/admin/orders/${orderId}/status`, null, {
      params: { status, trackingNumber },
    }),
  
  // Returns
  getAllReturnRequests: () => api.get('/admin/returns'),
  approveReturn: (orderId) => api.put(`/admin/returns/${orderId}/approve`),
  rejectReturn: (orderId, reason) =>
    api.put(`/admin/returns/${orderId}/reject`, null, { params: { reason } }),
  confirmReturnReceived: (orderId, condition) =>
    api.put(`/admin/returns/${orderId}/received`, null, { params: { condition } }),
  initiateRefund: (orderId) => api.put(`/admin/returns/${orderId}/refund`),
  completeRefund: (orderId) => api.put(`/admin/returns/${orderId}/refund-complete`),
};

export default api;