import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuthStore } from './store/authStore';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import {
  Login,
  Dashboard,
  AdminDashboard,
  UserManagement,
  TutorialManagement,
  SubmitReferral,
  Tutorials,
  Compensation
} from './config/routes';
import PublicReferral from './pages/PublicReferral';
import FloatingContactButton from './components/ui/FloatingContactButton';
import Settings from './pages/admin/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserSettings from './pages/UserSettings';

function AppRoutes() {
  const { initialize, isAuthenticated, user } = useAuthStore();
  
  // Initialize inactivity timer
  useInactivityTimer();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getDefaultRedirect = () => {
    if (!isAuthenticated) return '/login';
    return user?.role === 'admin' ? '/admin' : '/dashboard';
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/* <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        /> */}
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route path="/referral/:uuid" element={<PublicReferral />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/tutorials" element={<TutorialManagement />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          {/* User Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole="user">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit" element={<SubmitReferral />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/compensation" element={<Compensation />} />
            <Route path="/settings" element={<UserSettings />} />
          </Route>

          {/* Root Route */}
          <Route
            path="/"
            element={<Navigate to={getDefaultRedirect()} replace />}
          />
        </Route>

        {/* Catch-all route */}
        <Route
          path="*"
          element={<Navigate to={getDefaultRedirect()} replace />}
        />
      </Routes>
      <FloatingContactButton />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<LoadingSpinner />}>
        <AppRoutes />
      </React.Suspense>
    </BrowserRouter>
  );
}