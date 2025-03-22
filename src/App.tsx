
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { FinancialProvider } from './contexts/FinancialContext';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import Analysis from './pages/Analysis';
import Savings from './pages/Savings';
import AddHabit from './pages/AddHabit';
import NotFound from './pages/NotFound';
import DebtAnalysis from './pages/DebtAnalysis';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FinancialProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/add-habit" element={<AddHabit />} />
            <Route path="/debt-analysis" element={<DebtAnalysis />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </FinancialProvider>
    </QueryClientProvider>
  );
}

export default App;
