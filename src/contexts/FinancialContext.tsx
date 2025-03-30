
import React, { createContext, useContext } from 'react';
import { FinancialContextType } from '@/types/financial';
import { useFinancialState } from '@/hooks/useFinancialState';

// Re-export types for backward compatibility menggunakan proper 'export type' syntax
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
  
  return (
    <FinancialContext.Provider value={financialState}>
      {children}
    </FinancialContext.Provider>
  );
};
