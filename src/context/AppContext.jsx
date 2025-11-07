import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, userAPI } from '../services/api';
import { getImageUrl } from '../utils/Helpers';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUser(parsedUser);
      if (parsedUser.role !== 'ADMIN') {
        loadCartFromBackend(parsedUser);
      }
    } else {
      loadLocalCart();
    }
  };

  const loadCartFromBackend = async (userData = user) => {
    try {
      if (!userData?.email) return;
      const response = await cartAPI.getCart(userData.email);
      const itemsWithUrls = response.data.map(item => ({
  ...item,
  image: getImageUrl(item.image)
}));
      setCartItems(itemsWithUrls);
      localStorage.removeItem('localCart');
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const loadLocalCart = () => {
    const localCart = localStorage.getItem('localCart');
    if (localCart) setCartItems(JSON.parse(localCart));
  };

  const login = async (userData, token) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    // Merge local cart
    const localCart = localStorage.getItem('localCart');
    if (localCart) {
      try {
        const localItems = JSON.parse(localCart);
        if (localItems.length > 0) {
          await cartAPI.mergeCart(userData.email, localItems);
        }
      } catch (error) {
        console.error('Error merging cart:', error);
      }
    }

    // Handle pending cart item
    const pendingItem = localStorage.getItem('pendingCartItem');
    if (pendingItem) {
      try {
        const { product, quantity } = JSON.parse(pendingItem);
        await cartAPI.addToCart(userData.email, product.id, quantity);
        localStorage.removeItem('pendingCartItem');
        alert('Product added to cart!');
      } catch (error) {
        console.error('Error adding pending item:', error);
      }
    }

    await loadCartFromBackend(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCartItems([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('localCart');
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isLoggedIn || !user?.email) {
      localStorage.setItem('pendingCartItem', JSON.stringify({ product, quantity }));
      alert('Please login to add items to cart');
      return;
    }

    try {
      await cartAPI.addToCart(user.email, product.id, quantity);
      await loadCartFromBackend();
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const updateQuantity = async (itemId, change) => {
    try {
      const item = cartItems.find(i => i.id === itemId);
      if (!item) return;

      const newQuantity = item.quantity + change;
      if (newQuantity < 1) {
        await removeItem(itemId);
        return;
      }

      await cartAPI.updateCart(user.email, itemId, newQuantity);
      await loadCartFromBackend();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeFromCart(user.email, itemId);
      await loadCartFromBackend();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const response = await userAPI.updateProfile(updatedData);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    cartItems,
    setCartItems,
    isLoggedIn,
    user,
    login,
    logout,
    addToCart,
    updateQuantity,
    removeItem,
    updateUserProfile
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};