
import React, { createContext, useContext, useMemo } from 'react';
import { FinancialContextType } from '@/types/financial';
import { useFinancialState } from '@/hooks/useFinancialState';

// Use proper 'export type' syntax for re-exported types
export type { FinancialHabit, HabitType, SourceType, DebtAction, DebtStatus } from '@/types/financial';

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const financialState = useFinancialState();
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => financialState, [
    financialState.habits,
    financialState.currentMonth,
    financialState.totalIncome,
    financialState.totalExpense,
    financialState.totalSavings,
    financialState.totalDebt,
    financialState.loading
  ]);
  
  return (
    <FinancialContext.Provider value={contextValue}>
      {children}
    </FinancialContext.Provider>
  );
};
