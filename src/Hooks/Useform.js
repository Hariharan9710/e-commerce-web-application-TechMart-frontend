import { useState } from 'react';

export const useForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData(prev => {
    console.log(' Previous formData:', prev);

    const updated = {
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    };

    console.log(' New formData:', updated);
    return updated;
  });
};


  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
  };

  return { formData, setFormData, errors, setErrors, handleChange, resetForm };
};