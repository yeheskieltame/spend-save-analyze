
import { useState } from 'react';
import { FinancialHabit, HabitType } from '@/types/financial';

export function useFinancialUtilities(habits: FinancialHabit[]) {
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });

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

  return {
    currentMonth,
    setCurrentMonth,
    filterByMonth,
    filterByType,
    filterByYear,
    getAvailableMonths,
    getAvailableYears,
    getUnpaidDebts
  };
}
