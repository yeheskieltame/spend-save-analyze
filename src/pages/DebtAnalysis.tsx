
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, isAfter, parseISO } from 'date-fns';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  CreditCardIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  ClockIcon,
  ArrowRightCircleIcon
} from 'lucide-react';
import { toast } from "sonner";

import Layout from '@/components/Layout';
import { useFinancial, FinancialHabit } from '@/contexts/FinancialContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DebtAnalysis = () => {
  const navigate = useNavigate();
  const { habits, unpaidDebts, payDebt } = useFinancial();
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [selectedDebtId, setSelectedDebtId] = useState<string>('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  // Filter debts that are borrowed (not payments)
  const allDebts = habits.filter(
    habit => habit.type === 'debt' && habit.debtAction === 'borrow'
  );
  
  // Filter by search query
  const filteredDebts = allDebts.filter(debt => 
    debt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort debts: unpaid and overdue first, then unpaid, then paid
  const sortedDebts = [...filteredDebts].sort((a, b) => {
    // Function to check if debt is overdue
    const isOverdue = (debt: FinancialHabit) => {
      if (!debt.debtDueDate) return false;
      return isAfter(new Date(), parseISO(debt.debtDueDate));
    };
    
    // Check debt status
    const aIsPaid = a.debtStatus === 'paid';
    const bIsPaid = b.debtStatus === 'paid';
    
    // Check if overdue
    const aIsOverdue = isOverdue(a);
    const bIsOverdue = isOverdue(b);
    
    // Sort logic
    if (aIsPaid && !bIsPaid) return 1; // Paid goes later
    if (!aIsPaid && bIsPaid) return -1; // Unpaid comes first
    if (aIsOverdue && !bIsOverdue) return -1; // Overdue comes very first
    if (!aIsOverdue && bIsOverdue) return 1;
    
    // If both same status, sort by due date (closer due dates first)
    if (a.debtDueDate && b.debtDueDate) {
      return parseISO(a.debtDueDate).getTime() - parseISO(b.debtDueDate).getTime();
    }
    
    return 0; // Keep order if no other criteria
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const handleBackClick = () => {
    navigate('/dashboard');
  };
  
  const getRemainingDebtAmount = (debtId: string) => {
    // Find the original debt
    const debt = habits.find(h => h.id === debtId);
    if (!debt) return 0;
    
    // Calculate payments made
    const payments = habits.filter(
      h => h.type === 'debt' && h.debtAction === 'pay' && h.relatedToDebtId === debtId
    );
    
    const totalPaid = payments.reduce((sum, payment) => sum + Math.abs(payment.amount), 0);
    return Math.max(0, debt.amount - totalPaid);
  };
  
  const handlePayDebt = (debtId: string) => {
    setSelectedDebtId(debtId);
    const remainingAmount = getRemainingDebtAmount(debtId);
    setPaymentAmount(remainingAmount);
    setIsPaymentDialogOpen(true);
  };
  
  const submitPayment = () => {
    if (paymentAmount <= 0) {
      toast.error("Jumlah pembayaran harus lebih dari 0");
      return;
    }
    
    const remainingAmount = getRemainingDebtAmount(selectedDebtId);
    
    if (paymentAmount > remainingAmount) {
      toast.error("Jumlah pembayaran melebihi sisa hutang");
      return;
    }
    
    payDebt(selectedDebtId, paymentAmount);
    setIsPaymentDialogOpen(false);
  };
  
  const getDebtStatusInfo = (debt: FinancialHabit) => {
    const remaining = getRemainingDebtAmount(debt.id);
    
    if (debt.debtStatus === 'paid' || remaining <= 0) {
      return {
        status: 'Lunas',
        color: 'text-green-600',
        icon: <CheckCircleIcon className="w-4 h-4 text-green-600" />,
        remaining: 0
      };
    }
    
    const isOverdue = debt.debtDueDate && isAfter(new Date(), parseISO(debt.debtDueDate));
    
    if (isOverdue) {
      return {
        status: 'Jatuh Tempo',
        color: 'text-red-600',
        icon: <AlertCircleIcon className="w-4 h-4 text-red-600" />,
        remaining
      };
    }
    
    return {
      status: 'Belum Lunas',
      color: 'text-amber-600',
      icon: <ClockIcon className="w-4 h-4 text-amber-600" />,
      remaining
    };
  };
  
  const totalUnpaidDebt = unpaidDebts.reduce((sum, debt) => sum + (debt.remainingAmount || 0), 0);
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Analisis Hutang</h1>
          <Button variant="ghost" onClick={handleBackClick} className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Ringkasan
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Pantau status hutang dan lakukan pembayaran untuk mencapai kebebasan finansial.
        </p>
        
        <div className="flex justify-between items-center">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <CreditCardIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-orange-800">Total Hutang Belum Lunas</p>
              <p className="text-2xl font-bold text-orange-700">{formatCurrency(totalUnpaidDebt)}</p>
            </div>
          </div>
          
          <Link to="/add-habit">
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Tambah Hutang
            </Button>
          </Link>
        </div>
        
        <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Daftar Hutang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Cari hutang..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nama Hutang</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tanggal Peminjaman</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tanggal Jatuh Tempo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Jumlah Awal</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Sisa Hutang</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedDebts.length > 0 ? (
                    sortedDebts.map((debt) => {
                      const statusInfo = getDebtStatusInfo(debt);
                      
                      return (
                        <tr key={debt.id} className="bg-card transition-colors hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm">{debt.name}</td>
                          <td className="px-4 py-3 text-sm">{format(new Date(debt.date), 'dd MMM yyyy')}</td>
                          <td className="px-4 py-3 text-sm">
                            {debt.debtDueDate 
                              ? format(new Date(debt.debtDueDate), 'dd MMM yyyy')
                              : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-1.5">
                              {statusInfo.icon}
                              <span className={statusInfo.color}>{statusInfo.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium">
                            {formatCurrency(debt.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium">
                            {formatCurrency(statusInfo.remaining)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {statusInfo.status !== 'Lunas' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePayDebt(debt.id)}
                                className="h-8 text-sm gap-1"
                              >
                                <ArrowRightCircleIcon className="h-3.5 w-3.5" />
                                Bayar
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                        {searchQuery 
                          ? "Tidak ada hutang yang sesuai dengan pencarian" 
                          : "Belum ada hutang tercatat"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bayar Hutang</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Jumlah Pembayaran</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsPaymentDialogOpen(false)}
              >
                Batal
              </Button>
              <Button onClick={submitPayment}>Bayar Hutang</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DebtAnalysis;
