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


// ================= PROTECTED ROUTE =================

const ProtectedRoute = ({ children }) => {

  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn !== 'true') {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// ================= PUBLIC ROUTE =================

const PublicRoute = ({ children }) => {

  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    return <Navigate to="/" replace />;
  }

  return children;
};


// ================= APP ROUTES =================

const AppRoutes = () => {

  return (
    <Router>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* OTP */}
        <Route
          path="/verify-otp"
          element={<Otp />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* HOME */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </Router>
  );
};

export default AppRoutes;
