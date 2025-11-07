
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const API_ENDPOINTS = {
  images: `${API_BASE_URL}/images`,
  api: `${API_BASE_URL}/api`
};

export const APP_CONFIG = {
  taxRate: 0.18,
  returnPeriodDays: 15,
  autoPlayInterval: 3000,
  itemsPerPage: 12
};