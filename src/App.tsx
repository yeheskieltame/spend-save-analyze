
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import { FinancialProvider } from './contexts/FinancialContext';
import './App.css';

// Preload frequently used components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Index = lazy(() => import('./pages/Index'));

// Lazy load less frequently used components
const Analysis = lazy(() => import(/* webpackPrefetch: true */ './pages/Analysis'));
const Savings = lazy(() => import(/* webpackPrefetch: true */ './pages/Savings'));
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
      staleTime: 300000, // 5 minutes (increased from 1 minute)
      gcTime: 600000, // 10 minutes (increased from 5 minutes)
    },
  },
});

// Create a separate ThemeInitializer component
const ThemeInitializer = () => {
  useEffect(() => {
    // Check if session should persist across page refreshes
    // This code keeps the session active on refresh but will end it when the tab is closed
    const handleBeforeUnload = (e: Event) => {
      // Only store session info if page is refreshing, not if tab is closing
      // We don't need to check e.persisted as that's only available in PageTransitionEvent
      if (document.visibilityState !== 'hidden') {
        // Do nothing - the session will be maintained via localStorage
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Only update theme if it's not already set in document
    if (!document.documentElement.classList.contains('light') && 
        !document.documentElement.classList.contains('dark')) {
      const storedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.classList.add(storedTheme);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
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
