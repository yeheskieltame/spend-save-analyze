
import React from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// This wrapper component ensures that AuthProvider gets the proper router context
export const AuthProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // This ensures the navigate hook within AuthProvider has access to the router context
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
