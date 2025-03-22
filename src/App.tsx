
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinancialProvider } from "@/contexts/FinancialContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AddHabit from "./pages/AddHabit";
import Analysis from "./pages/Analysis";
import Savings from "./pages/Savings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FinancialProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-habit" element={<AddHabit />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FinancialProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
