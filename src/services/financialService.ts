
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { FinancialHabit, HabitType } from '@/types/financial';
import { mapDbRecordToHabit, mapHabitToDbRecord } from '@/utils/financialUtils';

export async function fetchHabits(userId: string | undefined): Promise<FinancialHabit[]> {
  if (!userId) {
    return [];
  }

  try {
    console.log('Fetching financial habits for user:', userId);
    const { data, error } = await supabase
      .from('financial_habits')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    console.log('Fetched habits:', data?.length || 0);
    return (data || []).map(mapDbRecordToHabit);
  } catch (error: any) {
    console.error('Error fetching financial habits:', error.message);
    toast.error('Gagal memuat data finansial');
    return [];
  }
}

export async function addHabitRecord(
  habit: Omit<FinancialHabit, 'id' | 'user_id'>,
  userId: string,
  habits: FinancialHabit[]
): Promise<void> {
  if (!userId) {
    toast.error('Anda harus login untuk menambahkan kebiasaan finansial');
    return;
  }

  try {
    if (habit.type === 'expense' && habit.source === 'savings') {
      const dbRecord = mapHabitToDbRecord(habit, userId);
      
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
      }, userId);
      
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
            }, userId);
            
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
        }, userId);
        
        const { error: borrowError } = await supabase
          .from('financial_habits')
          .insert([borrowRecord]);
          
        if (borrowError) throw borrowError;
        
        toast.success("Pinjaman baru berhasil dicatat!");
      }
    } else {
      const dbRecord = mapHabitToDbRecord(habit, userId);
      
      const { error: insertError } = await supabase
        .from('financial_habits')
        .insert([dbRecord]);
        
      if (insertError) throw insertError;
      
      toast.success("Kebiasaan finansial berhasil ditambahkan!");
    }
  } catch (error: any) {
    console.error('Error adding financial habit:', error.message);
    toast.error('Gagal menambahkan kebiasaan finansial');
    throw error;
  }
}

export async function payDebtRecord(
  debtId: string,
  amount: number,
  habits: FinancialHabit[],
  userId: string
): Promise<void> {
  if (!userId) {
    toast.error('Anda harus login untuk membayar hutang');
    return;
  }
  
  try {
    const debt = habits.find(h => h.id === debtId);
    
    if (!debt) {
      toast.error("Hutang tidak ditemukan!");
      return;
    }
    
    const totalPaidSoFar = habits
      .filter(h => h.type === 'debt' && h.debtAction === 'pay' && h.relatedToDebtId === debtId)
      .reduce((sum, payment) => sum + Math.abs(payment.amount), 0);
    
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
      debtAction: 'pay' as FinancialHabit['debtAction'],
      relatedToDebtId: debtId,
      remainingAmount: Math.max(0, remainingBeforeThisPayment - amount)
    };
    
    const paymentRecord = mapHabitToDbRecord(paymentData, userId);
    
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
    throw error;
  }
}

export async function deleteHabitRecord(id: string, habits: FinancialHabit[], userId: string): Promise<void> {
  if (!userId) {
    toast.error('Anda harus login untuk menghapus kebiasaan finansial');
    return;
  }
  
  try {
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
    throw error;
  }
}
