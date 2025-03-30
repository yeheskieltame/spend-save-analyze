
import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// This wrapper component ensures that AuthProvider gets the proper router context
export const AuthProviderWrapper = memo(({ children }: { children: React.ReactNode }) => {
  // This hook ensures the navigate hook within AuthProvider has access to the router context
  useLocation();
  
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
});
