
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type HabitType = 'income' | 'expense' | 'savings' | 'debt';
export type SourceType = 'current' | 'savings';
export type DebtAction = 'pay' | 'borrow';
export type DebtStatus = 'unpaid' | 'paid';

export interface FinancialHabit {
  id: string;
  name: string;
  type: HabitType;
  amount: number;
  date: string;
  source?: SourceType;
  debtAction?: DebtAction;
  debtDueDate?: string;
  debtStatus?: DebtStatus;
  relatedToDebtId?: string;
  remainingAmount?: number;
  user_id?: string;
}

interface FinancialContextType {
  habits: FinancialHabit[];
  addHabit: (habit: Omit<FinancialHabit, 'id' | 'user_id'>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  filterByMonth: (month: string) => FinancialHabit[];
  filterByType: (type: HabitType) => FinancialHabit[];
  filterByYear: (year: string) => FinancialHabit[];
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  totalDebt: number;
  availableMonths: string[];
  availableYears: string[];
  unpaidDebts: FinancialHabit[];
  payDebt: (debtId: string, amount: number) => Promise<void>;
  loading: boolean;
}

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
  
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });

  // Fetch financial habits from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    const fetchHabits = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('financial_habits')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        setHabits(data || []);
      } catch (error: any) {
        console.error('Error fetching financial habits:', error.message);
        toast.error('Gagal memuat data finansial');
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [user]);

  const addHabit = async (habit: Omit<FinancialHabit, 'id' | 'user_id'>) => {
    if (!user) {
      toast.error('Anda harus login untuk menambahkan kebiasaan finansial');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare habit with user_id
      const newHabit = {
        ...habit,
        user_id: user.id,
      };
      
      // Process based on habit type and source
      if (habit.type === 'expense' && habit.source === 'savings') {
        // If expense is from savings, add expense record
        const { data: expenseData, error: expenseError } = await supabase
          .from('financial_habits')
          .insert([newHabit])
          .select()
          .single();
          
        if (expenseError) throw expenseError;
        
        // Create savings deduction record
        const savingsDeduction = {
          name: `Deduction for: ${habit.name}`,
          type: 'savings' as HabitType,
          amount: -habit.amount,
          date: habit.date,
          user_id: user.id,
        };
        
        const { error: savingsError } = await supabase
          .from('financial_habits')
          .insert([savingsDeduction]);
          
        if (savingsError) throw savingsError;
        
        // Update local state
        const { data, error } = await supabase
          .from('financial_habits')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setHabits(data || []);
        
        toast.success("Pengeluaran dari tabungan berhasil dicatat!");
      }
      // Handle debt payments and loans
      else if (habit.type === 'debt') {
        if (habit.debtAction === 'pay') {
          // Find the debt being paid
          if (habit.relatedToDebtId) {
            const debtBeingPaid = habits.find(h => h.id === habit.relatedToDebtId);
            
            if (debtBeingPaid) {
              // Calculate remaining amount
              const totalPaidSoFar = habits
                .filter(h => h.type === 'debt' && h.debtAction === 'pay' && h.relatedToDebtId === habit.relatedToDebtId)
                .reduce((sum, h) => sum + h.amount, 0);
              
              const remainingBeforeThisPayment = debtBeingPaid.amount - totalPaidSoFar;
              const newRemainingAmount = remainingBeforeThisPayment - habit.amount;
              
              // Create payment record with negative amount (to reduce debt)
              const paymentRecord = {
                ...newHabit,
                amount: -habit.amount, // Negative to reduce debt total
                remainingAmount: newRemainingAmount > 0 ? newRemainingAmount : 0
              };
              
              // Insert payment record
              const { error: paymentError } = await supabase
                .from('financial_habits')
                .insert([paymentRecord]);
                
              if (paymentError) throw paymentError;
              
              // Update original debt status if fully paid
              if (newRemainingAmount <= 0) {
                const { error: updateError } = await supabase
                  .from('financial_habits')
                  .update({ debtStatus: 'paid' as DebtStatus })
                  .eq('id', habit.relatedToDebtId);
                  
                if (updateError) throw updateError;
                toast.success("Hutang berhasil dilunasi!");
              } else {
                toast.success("Pembayaran hutang berhasil dicatat!");
              }
              
              // Update local state
              const { data, error } = await supabase
                .from('financial_habits')
                .select('*')
                .eq('user_id', user.id);
                
              if (error) throw error;
              setHabits(data || []);
            }
          }
        } else {
          // For new debt, set initial values
          const borrowRecord = {
            ...newHabit,
            debtStatus: 'unpaid' as DebtStatus,
            remainingAmount: habit.amount
          };
          
          // Insert borrow record
          const { error: borrowError } = await supabase
            .from('financial_habits')
            .insert([borrowRecord]);
            
          if (borrowError) throw borrowError;
          
          // Update local state
          const { data, error } = await supabase
            .from('financial_habits')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) throw error;
          setHabits(data || []);
          
          toast.success("Pinjaman baru berhasil dicatat!");
        }
      } else {
        // For simple records (income, expense from current, savings)
        const { error: insertError } = await supabase
          .from('financial_habits')
          .insert([newHabit]);
          
        if (insertError) throw insertError;
        
        // Update local state
        const { data, error } = await supabase
          .from('financial_habits')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setHabits(data || []);
        
        toast.success("Kebiasaan finansial berhasil ditambahkan!");
      }
    } catch (error: any) {
      console.error('Error adding financial habit:', error.message);
      toast.error('Gagal menambahkan kebiasaan finansial');
    } finally {
      setLoading(false);
    }
  };

  // Function to pay a debt directly
  const payDebt = async (debtId: string, amount: number) => {
    if (!user) {
      toast.error('Anda harus login untuk membayar hutang');
      return;
    }
    
    try {
      setLoading(true);
      const debt = habits.find(h => h.id === debtId);
      
      if (!debt) {
        toast.error("Hutang tidak ditemukan!");
        return;
      }
      
      // Calculate remaining amount
      const totalPaidSoFar = habits
        .filter(h => h.type === 'debt' && h.debtAction === 'pay' && h.relatedToDebtId === debtId)
        .reduce((sum, h) => sum + h.amount, 0);
      
      const remainingBeforeThisPayment = debt.amount - totalPaidSoFar;
      
      if (remainingBeforeThisPayment <= 0) {
        toast.info("Hutang ini sudah lunas!");
        return;
      }
      
      // Create payment record
      const paymentRecord = {
        name: `Pembayaran untuk: ${debt.name}`,
        type: 'debt' as HabitType,
        amount: -amount, // Negative to reduce debt
        date: new Date().toISOString().split('T')[0],
        debtAction: 'pay' as DebtAction,
        relatedToDebtId: debtId,
        remainingAmount: Math.max(0, remainingBeforeThisPayment - amount),
        user_id: user.id
      };
      
      // Insert payment record
      const { error: paymentError } = await supabase
        .from('financial_habits')
        .insert([paymentRecord]);
        
      if (paymentError) throw paymentError;
      
      // Update original debt status if fully paid
      if (remainingBeforeThisPayment - amount <= 0) {
        const { error: updateError } = await supabase
          .from('financial_habits')
          .update({ debtStatus: 'paid' as DebtStatus })
          .eq('id', debtId);
          
        if (updateError) throw updateError;
        toast.success("Hutang berhasil dilunasi!");
      } else {
        toast.success("Pembayaran hutang berhasil dicatat!");
      }
      
      // Update local state
      const { data, error } = await supabase
        .from('financial_habits')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      setHabits(data || []);
      
    } catch (error: any) {
      console.error('Error paying debt:', error.message);
      toast.error('Gagal membayar hutang');
    } finally {
      setLoading(false);
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user) {
      toast.error('Anda harus login untuk menghapus kebiasaan finansial');
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if it's a debt with payments
      const habit = habits.find(h => h.id === id);
      if (habit?.type === 'debt' && habit?.debtAction === 'borrow') {
        // Find all related payments
        const relatedPayments = habits.filter(h => h.relatedToDebtId === id);
        if (relatedPayments.length > 0) {
          // Delete all related payments first
          for (const payment of relatedPayments) {
            const { error } = await supabase
              .from('financial_habits')
              .delete()
              .eq('id', payment.id);
              
            if (error) throw error;
          }
        }
      }
      
      // Delete the habit
      const { error } = await supabase
        .from('financial_habits')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setHabits(habits.filter(h => h.id !== id && h.relatedToDebtId !== id));
      
      toast.success("Kebiasaan finansial berhasil dihapus!");
    } catch (error: any) {
      console.error('Error deleting financial habit:', error.message);
      toast.error('Gagal menghapus kebiasaan finansial');
    } finally {
      setLoading(false);
    }
  };

  // Get all unpaid debts
  const getUnpaidDebts = (): FinancialHabit[] => {
    // Get all borrowed debts that are unpaid
    const borrowedDebts = habits.filter(
      h => h.type === 'debt' && h.debtAction === 'borrow' && h.debtStatus !== 'paid'
    );
    
    // For each debt, calculate the remaining amount
    return borrowedDebts.map(debt => {
      const payments = habits.filter(
        h => h.type === 'debt' && h.debtAction === 'pay' && h.relatedToDebtId === debt.id
      );
      
      const totalPaid = payments.reduce((sum, payment) => sum + Math.abs(payment.amount), 0);
      const remaining = debt.amount - totalPaid;
      
      return {
        ...debt,
        remainingAmount: remaining > 0 ? remaining : 0
      };
    }).filter(debt => (debt.remainingAmount || 0) > 0);
  };

  const filterByMonth = (month: string) => {
    return habits.filter(habit => habit.date.startsWith(month));
  };

  const filterByType = (type: HabitType) => {
    return habits.filter(habit => habit.type === type);
  };
  
  const filterByYear = (year: string) => {
    return habits.filter(habit => habit.date.startsWith(year));
  };

  const getAvailableMonths = (): string[] => {
    const months = new Set<string>();
    habits.forEach(habit => {
      const month = habit.date.substring(0, 7); // YYYY-MM
      months.add(month);
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a)); // Sort descending
  };
  
  const getAvailableYears = (): string[] => {
    const years = new Set<string>();
    habits.forEach(habit => {
      const year = habit.date.substring(0, 4); // YYYY
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a)); // Sort descending
  };

  const calculateTotals = (filteredHabits: FinancialHabit[]) => {
    return filteredHabits.reduce(
      (acc, habit) => {
        if (habit.type === 'income') acc.income += habit.amount;
        else if (habit.type === 'expense') acc.expense += habit.amount;
        else if (habit.type === 'savings') acc.savings += habit.amount;
        else if (habit.type === 'debt') acc.debt += habit.amount;
        return acc;
      },
      { income: 0, expense: 0, savings: 0, debt: 0 }
    );
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
    loading
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};
