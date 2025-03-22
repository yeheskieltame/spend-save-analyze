
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export type HabitType = 'income' | 'expense' | 'savings' | 'debt';
export type SourceType = 'current' | 'savings';
export type DebtAction = 'pay' | 'borrow';

export interface FinancialHabit {
  id: string;
  name: string;
  type: HabitType;
  amount: number;
  date: string;
  source?: SourceType;
  debtAction?: DebtAction;
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
        // Payment reduces debt (negative amount)
        const modifiedHabit = {
          ...newHabit,
          amount: -habit.amount
        };
        setHabits([...habits, modifiedHabit]);
        toast.success("Pembayaran hutang berhasil dicatat!");
      } else {
        // Borrowing increases debt (positive amount)
        setHabits([...habits, newHabit]);
        toast.success("Pinjaman baru berhasil dicatat!");
      }
    } else {
      setHabits([...habits, newHabit]);
      toast.success("Kebiasaan finansial berhasil ditambahkan!");
    }
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
    toast.success("Kebiasaan finansial berhasil dihapus!");
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
    availableYears
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};
