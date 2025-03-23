
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { FinancialProvider } from './contexts/FinancialContext';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import Analysis from './pages/Analysis';
import Savings from './pages/Savings';
import AddHabit from './pages/AddHabit';
import NotFound from './pages/NotFound';
import DebtAnalysis from './pages/DebtAnalysis';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Settings from './pages/Settings';

import './App.css';

const queryClient = new QueryClient();

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
            <Toaster position="top-right" />
          </FinancialProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
