import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

import LoginPage from "../pages/Auth/LoginPage";
import AuthLayout from "../pages/Auth/AuthLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route path="/*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
