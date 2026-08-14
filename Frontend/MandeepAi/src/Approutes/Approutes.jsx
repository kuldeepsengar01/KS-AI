import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from '../component/Register';
import Otp from '../component/Otp';
import Login from '../component/Login';
import Home from '../component/Home';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<Otp />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
