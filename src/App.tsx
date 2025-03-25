
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { FinancialProvider } from './contexts/FinancialContext';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// Use React.lazy for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Index = lazy(() => import('./pages/Index'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Savings = lazy(() => import('./pages/Savings'));
const AddHabit = lazy(() => import('./pages/AddHabit'));
const NotFound = lazy(() => import('./pages/NotFound'));
const DebtAnalysis = lazy(() => import('./pages/DebtAnalysis'));
const Auth = lazy(() => import('./pages/Auth'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Settings = lazy(() => import('./pages/Settings'));

// Create a loading component
const LoadingFallback = () => (
  <div className="min-h-screen w-full flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full bg-primary animate-spin"></div>
      </div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Configure React Query for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetch on window focus
      retry: 1, // Limit retry attempts
      staleTime: 30000, // 30 seconds
      cacheTime: 300000, // 5 minutes
    },
  },
});

// Create a separate ThemeInitializer component to use the useEffect hook
const ThemeInitializer = () => {
  React.useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.add(storedTheme);
  }, []);
  
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <FinancialProvider>
            {/* Initialize theme outside of Routes */}
            <ThemeInitializer />
            
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/add-habit" element={<AddHabit />} />
                <Route path="/debt-analysis" element={<DebtAnalysis />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster position="top-right" />
          </FinancialProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
