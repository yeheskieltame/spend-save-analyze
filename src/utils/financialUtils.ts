
import { FinancialHabit } from '@/types/financial';

export const mapDbRecordToHabit = (record: any): FinancialHabit => {
  return {
    id: record.id,
    name: record.name,
    type: record.type as FinancialHabit['type'],
    amount: record.amount,
    date: record.date,
    source: record.source as FinancialHabit['source'] | undefined,
    debtAction: record.debt_action as FinancialHabit['debtAction'] | undefined,
    debtDueDate: record.debt_due_date,
    debtStatus: record.debt_status as FinancialHabit['debtStatus'] | undefined,
    relatedToDebtId: record.related_to_debt_id,
    remainingAmount: record.remaining_amount,
    user_id: record.user_id
  };
};

export const mapHabitToDbRecord = (habit: Omit<FinancialHabit, 'id' | 'user_id'>, userId: string) => {
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

export const calculateTotals = (habits: FinancialHabit[]) => {
  return habits.reduce(
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
