import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SOS from '../pages/SOS';
import Dashboard from '../pages/Dashboard';
import useAuth from '../hooks/useAuth';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sos" element={isAuthenticated ? <SOS /> : <Login />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />
    </Routes>
  );
};

export default AppRoutes;