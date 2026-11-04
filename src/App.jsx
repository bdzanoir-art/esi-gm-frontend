import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './Context/ThemeContext';
import { RequestProvider } from './Context/RequestContext';
import { ToastProvider } from './Context/ToastContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './Components/PrivateRoute';


// ============= PUBLIC PAGES (بالأسماء الصحيحة) =============
import LandingPage from './Pages/landing-page'; // تأكدي: landing-page.jsx
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import VerifyCode from './Pages/VerifyCode';

// ============= DASHBOARDS =============
import SuperAdminDashboard from './Pages/SuperAdminDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import StorekeeperDashboard from './Pages/StorekeeperDashboard';
import StudentDashboard from './Pages/StudentDashboard';

// ============= OTHER PAGES =============
import LaboratoryInventory from './Pages/LaboratoryInventory';
import LaboratoryManagement from './Pages/LaboratoryManagement';
import UserManagement from './Pages/UserManagement';
import RequestWorkflow from './Pages/RequestWorkflow';
import RequestButtonsGuide from './Pages/RequestButtonsGuide';
import MyRequestsPage from './Pages/MyRequestsPage';
import ValidationSlipPage from './Pages/ValidationSlipPage';
import InputOutput from './Pages/inputOutput';
import MaterialTransfers from './Pages/MaterialTransfers';
import QRStockScanner from './Pages/QRStockScanner';
import Maintenance from './Pages/Maintenance';
import MyProject from './Pages/Myproject';
import MaintenanceManagement from './Pages/MaintenanceManagement';
import BrowseMaterials from './Pages/BrowseMaterials';
import Settings from './Pages/Settings';
import Reports from './Pages/Reports';

import './App.css';

import { useTheme } from './Context/ThemeContext';

function AppContent() {
  const { loading: authLoading } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-code" element={<VerifyCode />} />

                {/* SUPER ADMIN ROUTES - Protected */}
                <Route path="/dashboard/superadmin" element={
                  <PrivateRoute allowedRoles={['superadmin']}>
                    <SuperAdminDashboard />
                  </PrivateRoute>
                } />
                <Route path="/admin/users" element={
                  <PrivateRoute allowedRoles={['superadmin', 'admin']}>
                    <UserManagement />
                  </PrivateRoute>
                } />
                <Route path="/admin/laboratories" element={
                  <PrivateRoute allowedRoles={['superadmin', 'admin']}>
                    <LaboratoryManagement />
                  </PrivateRoute>
                } />

                {/* ADMIN ROUTES - Protected */}
                <Route path="/dashboard/admin" element={
                  <PrivateRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                } />
                <Route path="/inventory" element={
                  <PrivateRoute allowedRoles={['admin', 'superadmin', 'storekeeper']}>
                    <LaboratoryInventory />
                  </PrivateRoute>
                } />
                <Route path="/reports" element={
                  <PrivateRoute allowedRoles={['admin', 'superadmin']}>
                    <Reports />
                  </PrivateRoute>
                } />
                <Route path="/transfers" element={
                  <PrivateRoute allowedRoles={['admin', 'superadmin', 'storekeeper']}>
                    <MaterialTransfers />
                  </PrivateRoute>
                } />
                <Route path="/qr-scanner" element={
                  <PrivateRoute allowedRoles={['admin', 'superadmin', 'storekeeper']}>
                    <QRStockScanner />
                  </PrivateRoute>
                } />
                <Route path="/material-outputs" element={
                  <PrivateRoute allowedRoles={['admin', 'superadmin', 'storekeeper']}>
                    <InputOutput />
                  </PrivateRoute>
                } />

                {/* STOREKEEPER ROUTES - Protected */}
                <Route path="/dashboard/storekeeper" element={
                  <PrivateRoute allowedRoles={['storekeeper', 'admin', 'superadmin']}>
                    <StorekeeperDashboard />
                  </PrivateRoute>
                } />
                <Route path="/maintenance" element={
                  <PrivateRoute allowedRoles={['storekeeper', 'admin', 'superadmin']}>
                    <Maintenance />
                  </PrivateRoute>
                } />

                {/* STUDENT ROUTES - Protected */}
                <Route path="/dashboard/student" element={
                  <PrivateRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </PrivateRoute>
                } />
                <Route path="/projects" element={
                  <PrivateRoute allowedRoles={['student']}>
                    <MyProject />
                  </PrivateRoute>
                } />
                <Route path="/requests" element={
                  <PrivateRoute allowedRoles={['admin', 'superadmin', 'storekeeper']}>
                    <RequestWorkflow />
                  </PrivateRoute>
                } />
                <Route path="/materials/browse" element={
                  <PrivateRoute allowedRoles={['student', 'admin', 'superadmin', 'storekeeper']}>
                    <BrowseMaterials />
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute allowedRoles={['admin', 'superadmin', 'storekeeper']}>
                    <Settings />
                  </PrivateRoute>
                } />

                <Route path="/my-requests" element={
                  <PrivateRoute allowedRoles={['student']}>
                    <MyRequestsPage toggleTheme={toggleTheme} dark={darkMode} />
                  </PrivateRoute>
                } />

                {/* REQUEST WORKFLOW ROUTES */}
                <Route path="/requests/guide" element={<RequestButtonsGuide />} />

                {/* VALIDATION SLIP */}
                <Route path="/validation/:id" element={<ValidationSlipPage dark={darkMode} />} />

                {/* FALLBACK */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ToastProvider>
            <RequestProvider>
              <AppContent />
            </RequestProvider>
          </ToastProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
