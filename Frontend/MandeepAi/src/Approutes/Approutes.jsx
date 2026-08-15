import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Register from '../component/Register';
import Otp from '../component/Otp';
import Login from '../component/Login';
import Home from '../component/Home';

const ProtectedRoute = ({ children }) => {

  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {

  return (
    <Router>
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* OTP */}
        <Route
          path="/verify-otp"
          element={<Otp />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
