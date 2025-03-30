
import { useState, useEffect, useCallback, useMemo } from 'react';
import { FinancialHabit, HabitType, FinancialContextType } from '@/types/financial';
import { calculateTotals } from '@/utils/financialUtils';
import { useFinancialUtilities } from './useFinancialUtilities';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { mapDbRecordToHabit, mapHabitToDbRecord } from '@/utils/financialUtils';

export function useFinancialState(): FinancialContextType {
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

  const fetchHabits = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      console.log("Fetching financial habits for user:", user.id);
      
      const { data, error } = await supabase
        .from('financial_habits')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (error) {
        console.error("Error fetching habits:", error.message);
        throw error;
      }
      
      console.log(`Fetched ${data.length} habits`);
      
      const mappedData = data.map(record => mapDbRecordToHabit(record));
      setHabits(mappedData);
    } catch (error: any) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load financial data');
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch habits on mount and when user changes
  useEffect(() => {
    fetchHabits();
    
    // Set up realtime subscription if user is logged in
    if (user) {
      const subscription = supabase
        .channel('financial_habits_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'financial_habits',
            filter: `user_id=eq.${user.id}` 
          }, 
          () => {
            console.log('Financial data changed, refreshing...');
            fetchHabits();
          }
        )
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [fetchHabits, user]);

  const addHabit = useCallback(async (habit: Omit<FinancialHabit, 'id' | 'user_id'>) => {
    if (!user) {
      toast.error('You must be logged in to add habits');
      return;
    }
    
    try {
      const record = mapHabitToDbRecord(habit, user.id);
      
      const { data, error } = await supabase
        .from('financial_habits')
        .insert(record)
        .select()
        .single();
        
      if (error) throw error;
      
      const newHabit = mapDbRecordToHabit(data);
      setHabits(prev => [newHabit, ...prev]);
      toast.success('Financial habit added successfully');
    } catch (error: any) {
      console.error('Error adding habit:', error);
      toast.error('Failed to add financial habit');
    }
  }, [user]);

  const deleteHabit = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_habits')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setHabits(prev => prev.filter(habit => habit.id !== id));
      toast.success('Financial habit deleted successfully');
    } catch (error: any) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete financial habit');
    }
  }, []);

  const payDebt = useCallback(async (debtId: string, amount: number) => {
    if (!user) {
      toast.error('You must be logged in to pay debts');
      return;
    }
    
    try {
      const debt = habits.find(h => h.id === debtId);
      if (!debt) {
        toast.error('Debt not found');
        return;
      }
      
      // Create payment record
      const paymentHabit: Omit<FinancialHabit, 'id' | 'user_id'> = {
        name: `Payment for: ${debt.name}`,
        type: 'debt',
        amount: -amount, // Negative because it's a payment
        date: new Date().toISOString().split('T')[0],
        debtAction: 'pay',
        relatedToDebtId: debtId
      };
      
      const record = mapHabitToDbRecord(paymentHabit, user.id);
      
      const { data, error } = await supabase
        .from('financial_habits')
        .insert(record)
        .select()
        .single();
        
      if (error) throw error;
      
      const newPayment = mapDbRecordToHabit(data);
      
      // Check if debt is fully paid
      const payments = habits.filter(
        h => h.type === 'debt' && h.debtAction === 'pay' && h.relatedToDebtId === debtId
      );
      
      const totalPaid = payments.reduce((sum, payment) => sum + Math.abs(payment.amount), 0) + amount;
      
      if (totalPaid >= debt.amount) {
        // Update debt status to paid
        const { error: updateError } = await supabase
          .from('financial_habits')
          .update({ debt_status: 'paid' })
          .eq('id', debtId);
          
        if (updateError) throw updateError;
        
        // Update local state
        setHabits(prev => prev.map(h => 
          h.id === debtId ? { ...h, debtStatus: 'paid' } : h
        ));
      }
      
      // Add new payment to state
      setHabits(prev => [newPayment, ...prev]);
      toast.success('Debt payment recorded successfully');
    } catch (error: any) {
      console.error('Error paying debt:', error);
      toast.error('Failed to record debt payment');
    }
  }, [habits, user]);
  
  // Use useMemo for filtered habits and calculated totals
  const monthlyHabits = useMemo(() => filterByMonth(currentMonth), [filterByMonth, currentMonth]);
  
  const financialTotals = useMemo(() => calculateTotals(monthlyHabits), [monthlyHabits]);
  
  const { income: totalIncome, expense: totalExpense, savings: totalSavings, debt: totalDebt } = financialTotals;

  const availableMonths = useMemo(() => getAvailableMonths(), [getAvailableMonths]);
  const availableYears = useMemo(() => getAvailableYears(), [getAvailableYears]);
  const unpaidDebts = useMemo(() => getUnpaidDebts(), [getUnpaidDebts]);

  return {
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
    refreshData: fetchHabits
  };
}
