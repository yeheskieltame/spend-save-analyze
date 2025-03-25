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

const mapDbRecordToHabit = (record: any): FinancialHabit => {
  return {
    id: record.id,
    name: record.name,
    type: record.type as HabitType,
    amount: record.amount,
    date: record.date,
    source: record.source as SourceType | undefined,
    debtAction: record.debt_action as DebtAction | undefined,
    debtDueDate: record.debt_due_date,
    debtStatus: record.debt_status as DebtStatus | undefined,
    relatedToDebtId: record.related_to_debt_id,
    remainingAmount: record.remaining_amount,
    user_id: record.user_id
  };
};

const mapHabitToDbRecord = (habit: Omit<FinancialHabit, 'id' | 'user_id'>, userId: string) => {
  return {
    name: habit.name,
    type: habit.type,
    amount: habit.amount,
    date: habit.date,
    source: habit.source,
    debt_action: habit.debtAction,
    debt_due_date: habit.debtDueDate,
    debt_status: habit.debtStatus,
    related_to_debt_id: habit.relatedToDebtId,
    remaining_amount: habit.remainingAmount,
    user_id: userId
  };
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<FinancialHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });

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
        
        const mappedHabits = (data || []).map(mapDbRecordToHabit);
        setHabits(mappedHabits);
      } catch (error: any) {
        console.error('Error fetching financial habits:', error.message);
        toast.error('Gagal memuat data finansial');
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();

    const channel = supabase
      .channel('financial_habits_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'financial_habits',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Real-time change:', payload);
        
        fetchHabits();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addHabit = async (habit: Omit<FinancialHabit, 'id' | 'user_id'>) => {
    if (!user) {
      toast.error('Anda harus login untuk menambahkan kebiasaan finansial');
      return;
    }

    try {
      setLoading(true);
      
      if (habit.type === 'expense' && habit.source === 'savings') {
        const dbRecord = mapHabitToDbRecord(habit, user.id);
        
        const { data: expenseData, error: expenseError } = await supabase
          .from('financial_habits')
          .insert([dbRecord])
          .select()
          .single();
          
        if (expenseError) throw expenseError;
        
        const savingsDeduction = mapHabitToDbRecord({
          name: `Deduction for: ${habit.name}`,
          type: 'savings',
          amount: -habit.amount,
          date: habit.date
        }, user.id);
        
        const { error: savingsError } = await supabase
          .from('financial_habits')
          .insert([savingsDeduction]);
          
        if (savingsError) throw savingsError;
        
        toast.success("Pengeluaran dari tabungan berhasil dicatat!");
      }
      else if (habit.type === 'debt') {
        if (habit.debtAction === 'pay') {
          if (habit.relatedToDebtId) {
            const debtBeingPaid = habits.find(h => h.id === habit.relatedToDebtId);
            
            if (debtBeingPaid) {
              const totalPaidSoFar = habits
                .filter(h => h.type === 'debt' && h.debtAction === 'pay' && h.relatedToDebtId === habit.relatedToDebtId)
                .reduce((sum, h) => sum + h.amount, 0);
              
              const remainingBeforeThisPayment = debtBeingPaid.amount - totalPaidSoFar;
              const newRemainingAmount = remainingBeforeThisPayment - habit.amount;
              
              const paymentRecord = mapHabitToDbRecord({
                ...habit,
                amount: -habit.amount,
                remainingAmount: newRemainingAmount > 0 ? newRemainingAmount : 0
              }, user.id);
              
              const { error: paymentError } = await supabase
                .from('financial_habits')
                .insert([paymentRecord]);
                
              if (paymentError) throw paymentError;
              
              if (newRemainingAmount <= 0) {
                const { error: updateError } = await supabase
                  .from('financial_habits')
                  .update({ debt_status: 'paid' })
                  .eq('id', habit.relatedToDebtId);
                  
                if (updateError) throw updateError;
                toast.success("Hutang berhasil dilunasi!");
              } else {
                toast.success("Pembayaran hutang berhasil dicatat!");
              }
            }
          }
        } else {
          const borrowRecord = mapHabitToDbRecord({
            ...habit,
            debtStatus: 'unpaid',
            remainingAmount: habit.amount
          }, user.id);
          
          const { error: borrowError } = await supabase
            .from('financial_habits')
            .insert([borrowRecord]);
            
          if (borrowError) throw borrowError;
          
          toast.success("Pinjaman baru berhasil dicatat!");
        }
      } else {
        const dbRecord = mapHabitToDbRecord(habit, user.id);
        
        const { error: insertError } = await supabase
          .from('financial_habits')
          .insert([dbRecord]);
          
        if (insertError) throw insertError;
        
        toast.success("Kebiasaan finansial berhasil ditambahkan!");
      }
    } catch (error: any) {
      console.error('Error adding financial habit:', error.message);
      toast.error('Gagal menambahkan kebiasaan finansial');
    } finally {
      setLoading(false);
    }
  };

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
      
      const totalPaidSoFar = habits
        .filter(h => h.type === 'debt' && h.debtAction === 'pay' && h.relatedToDebtId === debtId)
        .reduce((sum, h) => sum + h.amount, 0);
      
      const remainingBeforeThisPayment = debt.amount - totalPaidSoFar;
      
      if (remainingBeforeThisPayment <= 0) {
        toast.info("Hutang ini sudah lunas!");
        return;
      }
      
      const paymentData = {
        name: `Pembayaran untuk: ${debt.name}`,
        type: 'debt' as HabitType,
        amount: -amount,
        date: new Date().toISOString().split('T')[0],
        debtAction: 'pay' as DebtAction,
        relatedToDebtId: debtId,
        remainingAmount: Math.max(0, remainingBeforeThisPayment - amount)
      };
      
      const paymentRecord = mapHabitToDbRecord(paymentData, user.id);
      
      const { error: paymentError } = await supabase
        .from('financial_habits')
        .insert([paymentRecord]);
        
      if (paymentError) throw paymentError;
      
      if (remainingBeforeThisPayment - amount <= 0) {
        const { error: updateError } = await supabase
          .from('financial_habits')
          .update({ debt_status: 'paid' })
          .eq('id', debtId);
          
        if (updateError) throw updateError;
        toast.success("Hutang berhasil dilunasi!");
      } else {
        toast.success("Pembayaran hutang berhasil dicatat!");
      }
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
      
      const habit = habits.find(h => h.id === id);
      if (habit?.type === 'debt' && habit?.debtAction === 'borrow') {
        const relatedPayments = habits.filter(h => h.relatedToDebtId === id);
        if (relatedPayments.length > 0) {
          for (const payment of relatedPayments) {
            const { error } = await supabase
              .from('financial_habits')
              .delete()
              .eq('id', payment.id);
              
            if (error) throw error;
          }
        }
      }
      
      const { error } = await supabase
        .from('financial_habits')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Kebiasaan finansial berhasil dihapus!");
    } catch (error: any) {
      console.error('Error deleting financial habit:', error.message);
      toast.error('Gagal menghapus kebiasaan finansial');
    } finally {
      setLoading(false);
    }
  };

  const getUnpaidDebts = (): FinancialHabit[] => {
    const borrowedDebts = habits.filter(
      h => h.type === 'debt' && h.debtAction === 'borrow' && h.debtStatus !== 'paid'
    );
    
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
      const month = habit.date.substring(0, 7);
      months.add(month);
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  };
  
  const getAvailableYears = (): string[] => {
    const years = new Set<string>();
    habits.forEach(habit => {
      const year = habit.date.substring(0, 4);
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
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
