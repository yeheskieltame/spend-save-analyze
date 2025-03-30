
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { FinancialHabit, FinancialContextType, HabitType } from '@/types/financial';
import { calculateTotals } from '@/utils/financialUtils';
import { fetchHabits, addHabitRecord, payDebtRecord, deleteHabitRecord } from '@/services/financialService';
import { useFinancialUtilities } from '@/hooks/useFinancialUtilities';

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<FinancialHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const {
    currentMonth,
    setCurrentMonth,
    filterByMonth,
    filterByType,
    filterByYear,
    getAvailableMonths,
    getAvailableYears,
    getUnpaidDebts
  } = useFinancialUtilities(habits);

  const fetchUserHabits = async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const habitsData = await fetchHabits(user.id);
      setHabits(habitsData);
    } catch (error) {
      console.error('Error in fetchUserHabits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHabits();

    if (user) {
      const channel = supabase
        .channel('financial_habits_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'financial_habits',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          console.log('Real-time database change detected:', payload);
          fetchUserHabits();
        })
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const refreshData = async () => {
    await fetchUserHabits();
  };

  const addHabit = async (habit: Omit<FinancialHabit, 'id' | 'user_id'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await addHabitRecord(habit, user.id, habits);
      await fetchUserHabits();
    } catch (error) {
      console.error('Error in addHabit:', error);
    } finally {
      setLoading(false);
    }
  };

  const payDebt = async (debtId: string, amount: number) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await payDebtRecord(debtId, amount, habits, user.id);
      await fetchUserHabits();
    } catch (error) {
      console.error('Error in payDebt:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await deleteHabitRecord(id, habits, user.id);
      await fetchUserHabits();
    } catch (error) {
      console.error('Error in deleteHabit:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHabits = filterByMonth(currentMonth);
  const { income: totalIncome, expense: totalExpense, savings: totalSavings, debt: totalDebt } = 
    calculateTotals(filteredHabits);

  const availableMonths = getAvailableMonths();
  const availableYears = getAvailableYears();
  const unpaidDebts = getUnpaidDebts();

  const value = {
    habits,
    addHabit,
    deleteHabit,
    filterByMonth,
    filterByType,
    filterByYear,
    currentMonth,
    setCurrentMonth,
    totalIncome,
    totalExpense,
    totalSavings,
    totalDebt,
    availableMonths,
    availableYears,
    unpaidDebts,
    payDebt,
    loading,
    refreshData
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};
