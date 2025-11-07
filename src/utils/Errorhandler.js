export const handleAPIError = (error, defaultMessage = 'An error occurred') => {
  const message = error.response?.data?.message || defaultMessage;
  console.error('API Error:', error);
  alert(message);
  return message;
};