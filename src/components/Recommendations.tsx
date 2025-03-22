
import React from 'react';
import { useFinancial } from '@/contexts/FinancialContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircleIcon, CheckCircleIcon, InfoIcon, TrendingUpIcon, CreditCardIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isAfter, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Recommendations = () => {
  const { totalIncome, totalExpense, totalSavings, totalDebt, unpaidDebts } = useFinancial();
  
  const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  const savingsRatio = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  const debtRatio = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : 0;
  
  const renderExpenseRecommendation = () => {
    if (expenseRatio > 50) {
      return {
        icon: <AlertCircleIcon className="h-5 w-5 text-red-600" />,
        title: 'Pengeluaran Tinggi',
        description: 'Anda menghabiskan lebih dari 50% pendapatan. Pertimbangkan untuk mengurangi pengeluaran!',
        color: 'bg-red-50 border-red-100',
        iconBg: 'bg-red-100',
        titleColor: 'text-red-800',
      };
    } else if (expenseRatio > 30) {
      return {
        icon: <InfoIcon className="h-5 w-5 text-amber-600" />,
        title: 'Pengeluaran Sedang',
        description: 'Pengeluaran Anda masih dalam batas wajar. Terus pantau untuk penghematan lebih!',
        color: 'bg-amber-50 border-amber-100',
        iconBg: 'bg-amber-100',
        titleColor: 'text-amber-800',
      };
    } else {
      return {
        icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
        title: 'Pengeluaran Terkendali',
        description: 'Bagus! Pengeluaran Anda terkendali dengan baik. Pertahankan kebiasaan ini!',
        color: 'bg-green-50 border-green-100',
        iconBg: 'bg-green-100',
        titleColor: 'text-green-800',
      };
    }
  };
  
  const renderSavingsRecommendation = () => {
    if (savingsRatio < 10) {
      return {
        icon: <AlertCircleIcon className="h-5 w-5 text-red-600" />,
        title: 'Tabungan Rendah',
        description: 'Tabungan Anda kurang dari 10%. Prioritaskan menabung lebih banyak untuk keamanan finansial!',
        color: 'bg-red-50 border-red-100',
        iconBg: 'bg-red-100',
        titleColor: 'text-red-800',
      };
    } else if (savingsRatio < 20) {
      return {
        icon: <InfoIcon className="h-5 w-5 text-amber-600" />,
        title: 'Tabungan Sedang',
        description: 'Anda menabung cukup baik. Cobalah tingkatkan hingga 20% untuk masa depan yang lebih aman!',
        color: 'bg-amber-50 border-amber-100',
        iconBg: 'bg-amber-100',
        titleColor: 'text-amber-800',
      };
    } else {
      return {
        icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
        title: 'Tabungan Baik',
        description: 'Selamat! Anda telah menabung lebih dari 20% pendapatan. Ini sangat baik untuk masa depan Anda!',
        color: 'bg-green-50 border-green-100',
        iconBg: 'bg-green-100',
        titleColor: 'text-green-800',
      };
    }
  };
  
  const renderDebtRecommendation = () => {
    // Check for overdue debts
    const hasOverdueDebts = unpaidDebts.some(debt => 
      debt.debtDueDate && isAfter(new Date(), parseISO(debt.debtDueDate))
    );
    
    // Calculate total remaining debt
    const totalRemainingDebt = unpaidDebts.reduce((sum, debt) => sum + (debt.remainingAmount || 0), 0);
    
    if (hasOverdueDebts) {
      return {
        icon: <AlertCircleIcon className="h-5 w-5 text-red-600" />,
        title: 'Hutang Jatuh Tempo',
        description: 'Anda memiliki hutang yang sudah jatuh tempo! Segera lakukan pembayaran untuk menghindari denda atau bunga tambahan.',
        color: 'bg-red-50 border-red-100',
        iconBg: 'bg-red-100',
        titleColor: 'text-red-800',
        highPriority: true
      };
    }
    
    if (!totalIncome) {
      return {
        icon: <InfoIcon className="h-5 w-5 text-blue-600" />,
        title: 'Belum Ada Data Hutang',
        description: 'Tambahkan data pemasukan dan hutang untuk mendapatkan rekomendasi.',
        color: 'bg-blue-50 border-blue-100',
        iconBg: 'bg-blue-100',
        titleColor: 'text-blue-800',
        highPriority: false
      };
    } else if (totalRemainingDebt > 0) {
      if (debtRatio > 30) {
        return {
          icon: <AlertCircleIcon className="h-5 w-5 text-red-600" />,
          title: 'Hutang Tinggi',
          description: 'Hutang Anda melebihi 30% dari pendapatan. Prioritaskan pelunasan hutang terlebih dahulu sebelum belanja atau menabung!',
          color: 'bg-red-50 border-red-100',
          iconBg: 'bg-red-100',
          titleColor: 'text-red-800',
          highPriority: true
        };
      } else if (debtRatio > 15) {
        return {
          icon: <InfoIcon className="h-5 w-5 text-amber-600" />,
          title: 'Hutang Sedang',
          description: 'Hutang Anda masih dalam batas wajar. Tetap prioritaskan pelunasan secara bertahap untuk bebas dari beban keuangan.',
          color: 'bg-amber-50 border-amber-100',
          iconBg: 'bg-amber-100',
          titleColor: 'text-amber-800',
          highPriority: false
        };
      } else {
        return {
          icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
          title: 'Hutang Terkendali',
          description: 'Hutang Anda rendah dan terkendali. Tetap konsisten membayar untuk segera bebas dari hutang.',
          color: 'bg-green-50 border-green-100',
          iconBg: 'bg-green-100',
          titleColor: 'text-green-800',
          highPriority: false
        };
      }
    } else {
      return {
        icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
        title: 'Bebas Hutang',
        description: 'Selamat! Anda tidak memiliki hutang. Pertahankan kondisi finansial bebas hutang ini!',
        color: 'bg-green-50 border-green-100',
        iconBg: 'bg-green-100',
        titleColor: 'text-green-800',
        highPriority: false
      };
    }
  };
  
  // Get upcoming debt due dates
  const getUpcomingDueDate = () => {
    const upcoming = unpaidDebts
      .filter(debt => debt.debtDueDate && !isAfter(new Date(), parseISO(debt.debtDueDate)))
      .sort((a, b) => {
        const dateA = a.debtDueDate ? parseISO(a.debtDueDate).getTime() : Infinity;
        const dateB = b.debtDueDate ? parseISO(b.debtDueDate).getTime() : Infinity;
        return dateA - dateB;
      })[0];
      
    return upcoming;
  };
  
  const upcomingDebt = getUpcomingDueDate();
  
  const expenseRec = renderExpenseRecommendation();
  const savingsRec = renderSavingsRecommendation();
  const debtRec = renderDebtRecommendation();
  
  const renderGeneralTip = () => {
    const tips = [
      "Buatlah anggaran untuk setiap kategori pengeluaran bulanan.",
      "Prioritaskan kebutuhan pokok sebelum keinginan.",
      "Catat semua pengeluaran, bahkan yang kecil, untuk memahami pola belanja.",
      "Sediakan dana darurat setara 3-6 bulan pengeluaran.",
      "Tentukan tujuan keuangan jangka pendek dan jangka panjang.",
      "Lakukan evaluasi keuangan secara berkala setiap bulan.",
      "Gunakan aturan 50/30/20: 50% kebutuhan, 30% keinginan, 20% tabungan.",
      "Hindari utang konsumtif dan fokus pada utang produktif.",
      "Lunasi hutang dengan bunga tertinggi terlebih dahulu.",
      "Jangan meminjam untuk membayar hutang yang sudah ada.",
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  };
  
  // Determine display order based on high priority
  const recommendations = [
    { type: 'debt', rec: debtRec, priority: debtRec.highPriority ? 3 : 0 },
    { type: 'expense', rec: expenseRec, priority: 1 },
    { type: 'savings', rec: savingsRec, priority: 0 }
  ].sort((a, b) => b.priority - a.priority);
  
  return (
    <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Rekomendasi Cerdas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalIncome > 0 ? (
          <>
            {recommendations.map((item, index) => (
              <div key={index} className={cn("p-4 rounded-lg border", item.rec.color)}>
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-full", item.rec.iconBg)}>
                    {item.rec.icon}
                  </div>
                  <div>
                    <p className={cn("font-medium", item.rec.titleColor)}>{item.rec.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.rec.description}</p>
                    
                    {/* Add action button for debts */}
                    {item.type === 'debt' && unpaidDebts.length > 0 && (
                      <Link to="/debt-analysis">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="mt-3 text-xs"
                        >
                          Lihat Hutang
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Upcoming debt due date reminder */}
            {upcomingDebt && (
              <div className="p-4 rounded-lg border bg-orange-50 border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <CreditCardIcon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-orange-800">Pengingat Jatuh Tempo</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hutang "{upcomingDebt.name}" akan jatuh tempo pada{' '}
                      <strong>{format(parseISO(upcomingDebt.debtDueDate as string), 'dd MMMM yyyy')}</strong>.
                      Segera siapkan dana untuk pembayaran!
                    </p>
                    <Link to="/debt-analysis">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="mt-3 text-xs"
                      >
                        Bayar Sekarang
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <InfoIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-800">Mulai Catat Keuangan</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tambahkan pendapatan, pengeluaran, dan tabungan Anda untuk mendapatkan rekomendasi personal!
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <TrendingUpIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-indigo-800">Tips Keuangan</p>
              <p className="text-sm text-muted-foreground mt-1">{renderGeneralTip()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Recommendations;
