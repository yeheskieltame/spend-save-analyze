
import React from 'react';
import { useFinancial } from '@/contexts/FinancialContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircleIcon, CheckCircleIcon, InfoIcon, TrendingUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Recommendations = () => {
  const { totalIncome, totalExpense, totalSavings } = useFinancial();
  
  const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  const savingsRatio = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  
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
  
  const expenseRec = renderExpenseRecommendation();
  const savingsRec = renderSavingsRecommendation();
  
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
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  };
  
  return (
    <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Rekomendasi Cerdas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalIncome > 0 ? (
          <>
            <div className={cn("p-4 rounded-lg border", expenseRec.color)}>
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", expenseRec.iconBg)}>
                  {expenseRec.icon}
                </div>
                <div>
                  <p className={cn("font-medium", expenseRec.titleColor)}>{expenseRec.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{expenseRec.description}</p>
                </div>
              </div>
            </div>
            
            <div className={cn("p-4 rounded-lg border", savingsRec.color)}>
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", savingsRec.iconBg)}>
                  {savingsRec.icon}
                </div>
                <div>
                  <p className={cn("font-medium", savingsRec.titleColor)}>{savingsRec.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{savingsRec.description}</p>
                </div>
              </div>
            </div>
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
