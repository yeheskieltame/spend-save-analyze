
// Financial habit types
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

// Context type
export interface FinancialContextType {
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
  refreshData: () => Promise<void>;
}
