import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.includes('@')) errs.email = 'Valid email is required';
    if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      alert('Registration successful. Please login.');
      navigate('/login');
    } catch (err){
     console.error('registration error:',err.response?.data||err.message);
      alert('Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'password', 'confirmPassword'].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field === 'confirmPassword' ? 'confirm password' : field}`}
                required
                className={`w-full px-4 py-2 border ${
                  errors[field] ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none`}
              />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;