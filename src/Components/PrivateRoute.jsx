import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    // Determine user role from user data or default to 'student'
    const userRole = user?.role || user?.user?.role || 'student';
    
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'admin':
          return <Navigate to="/dashboard/admin" replace />;
        case 'superadmin':
          return <Navigate to="/dashboard/superadmin" replace />;
        case 'storekeeper':
          return <Navigate to="/dashboard/storekeeper" replace />;
        default:
          return <Navigate to="/dashboard/student" replace />;
      }
    }
  }

  return children;
};

export default PrivateRoute;
