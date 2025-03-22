
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

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
  debtDueDate?: string;  // Added debt due date
  debtStatus?: DebtStatus; // Added debt status
  relatedToDebtId?: string; // Reference to the original debt for payments
  remainingAmount?: number; // Remaining amount to be paid
}

interface FinancialContextType {
  habits: FinancialHabit[];
  addHabit: (habit: Omit<FinancialHabit, 'id'>) => void;
  deleteHabit: (id: string) => void;
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
  unpaidDebts: FinancialHabit[]; // Add unpaid debts getter
  payDebt: (debtId: string, amount: number) => void; // Add pay debt function
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
  const [habits, setHabits] = useState<FinancialHabit[]>(() => {
    const savedHabits = localStorage.getItem('financialHabits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });
  
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    localStorage.setItem('financialHabits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit: Omit<FinancialHabit, 'id'>) => {
    const newHabit = {
      ...habit,
      id: crypto.randomUUID(),
    };
    
    // Process based on habit type and source
    if (habit.type === 'expense' && habit.source === 'savings') {
      // If expense is from savings, reduce savings
      const savingsDeduction = {
        id: crypto.randomUUID(),
        name: `Deduction for: ${habit.name}`,
        type: 'savings' as HabitType,
        amount: -habit.amount, // Negative amount to reduce savings
        date: habit.date,
      };
      setHabits([...habits, newHabit, savingsDeduction]);
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
            
            // Update original debt status if fully paid
            if (newRemainingAmount <= 0) {
              setHabits(habits.map(h => {
                if (h.id === habit.relatedToDebtId) {
                  return {...h, debtStatus: 'paid' as DebtStatus};
                }
                return h;
              }));
              toast.success("Hutang berhasil dilunasi!");
            } else {
              toast.success("Pembayaran hutang berhasil dicatat!");
            }
            
            setHabits([...habits, paymentRecord]);
          }
        }
      } else {
        // For new debt, set initial values
        const borrowRecord = {
          ...newHabit,
          debtStatus: 'unpaid' as DebtStatus,
          remainingAmount: habit.amount
        };
        setHabits([...habits, borrowRecord]);
        toast.success("Pinjaman baru berhasil dicatat!");
      }
    } else {
      setHabits([...habits, newHabit]);
      toast.success("Kebiasaan finansial berhasil ditambahkan!");
    }
  };

  // Function to pay a debt directly
  const payDebt = (debtId: string, amount: number) => {
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
      id: crypto.randomUUID(),
      name: `Pembayaran untuk: ${debt.name}`,
      type: 'debt' as HabitType,
      amount: -amount, // Negative to reduce debt
      date: new Date().toISOString().split('T')[0],
      debtAction: 'pay' as DebtAction,
      relatedToDebtId: debtId,
      remainingAmount: Math.max(0, remainingBeforeThisPayment - amount)
    };
    
    // Update original debt status if fully paid
    if (remainingBeforeThisPayment - amount <= 0) {
      setHabits([
        ...habits.map(h => {
          if (h.id === debtId) {
            return {...h, debtStatus: 'paid' as DebtStatus};
          }
          return h;
        }),
        paymentRecord
      ]);
      toast.success("Hutang berhasil dilunasi!");
    } else {
      setHabits([...habits, paymentRecord]);
      toast.success("Pembayaran hutang berhasil dicatat!");
    }
  };

  const deleteHabit = (id: string) => {
    // Check if it's a debt with payments
    const habit = habits.find(h => h.id === id);
    if (habit?.type === 'debt' && habit?.debtAction === 'borrow') {
      // Find all related payments
      const relatedPayments = habits.filter(h => h.relatedToDebtId === id);
      if (relatedPayments.length > 0) {
        // Delete all related payments first
        setHabits(habits.filter(h => h.relatedToDebtId !== id && h.id !== id));
      } else {
        setHabits(habits.filter(h => h.id !== id));
      }
    } else {
      setHabits(habits.filter(h => h.id !== id));
    }
    toast.success("Kebiasaan finansial berhasil dihapus!");
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
    payDebt
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};
