// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');

  if (!user) {
    // Agar user login nahi hai, redirect karo login page pe
    return <Navigate to="/login" replace />;
  }

  return children; // Agar user hai toh requested component dikhao
}

export default ProtectedRoute;
