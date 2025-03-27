
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import { FinancialProvider } from './contexts/FinancialContext';
import './App.css';

// Use React.lazy for code splitting with better loading patterns
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

// Improved loading component with optimized animations
const LoadingFallback = () => (
  <div className="min-h-screen w-full flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Configure React Query with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60000, // 1 minute (increased from 30 seconds)
      gcTime: 300000, // 5 minutes
    },
  },
});

// Create a separate ThemeInitializer component
const ThemeInitializer = () => {
  React.useEffect(() => {
    // Only update theme if it's not already set in document
    if (!document.documentElement.classList.contains('light') && 
        !document.documentElement.classList.contains('dark')) {
      const storedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.classList.add(storedTheme);
    }
  }, []);
  
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeInitializer />
        <AuthProvider>
          <FinancialProvider>
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
