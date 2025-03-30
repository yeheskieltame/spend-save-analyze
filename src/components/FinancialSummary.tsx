
import React, { useMemo, memo } from 'react';
import { useFinancial } from '@/contexts/FinancialContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, PiggyBankIcon, TrendingUpIcon } from 'lucide-react';
import { format } from 'date-fns';

// Create smaller components to improve performance
const SummaryCard = memo(({ 
  icon: Icon, 
  bgClass, 
  textClass, 
  title, 
  amount 
}: { 
  icon: React.ElementType; 
  bgClass: string; 
  textClass: string; 
  title: string; 
  amount: string;
}) => (
  <div className={`flex items-center justify-between p-4 rounded-lg ${bgClass} transition-all hover:shadow-sm`}>
    <div className="flex items-center gap-3">
      <div className={`${bgClass.replace('50', '100')} p-2 rounded-full`}>
        <Icon className={`h-5 w-5 ${textClass}`} />
      </div>
      <div>
        <p className={`text-sm font-medium ${textClass.replace('600', '800')}`}>{title}</p>
        <p className={`text-2xl font-bold ${textClass.replace('600', '700')}`}>{amount}</p>
      </div>
    </div>
  </div>
));

const ProgressBar = memo(({ 
  label, 
  percentage, 
  color, 
  targetMessage 
}: { 
  label: string; 
  percentage: string; 
  color: string; 
  targetMessage: string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm font-medium">{percentage}%</p>
    </div>
    <div className="w-full bg-muted rounded-full h-2">
      <div 
        className={`bg-${color} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(100, parseInt(percentage))}%` }}
      ></div>
    </div>
    <p className="text-xs text-muted-foreground">{targetMessage}</p>
  </div>
));

const FinancialSummary = memo(() => {
  const { totalIncome, totalExpense, totalSavings, currentMonth } = useFinancial();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Using useMemo for financial calculations
  const balance = useMemo(() => 
    totalIncome - totalExpense - totalSavings, 
    [totalIncome, totalExpense, totalSavings]
  );
  
  // Calculate financial ratios with useMemo
  const expenseRatio = useMemo(() => 
    totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(0) : "0",
    [totalExpense, totalIncome]
  );
  
  const savingsRatio = useMemo(() => 
    totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(0) : "0",
    [totalSavings, totalIncome]
  );
  
  const balanceRatio = useMemo(() => 
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : "0",
    [balance, totalIncome]
  );
  
  // Format for current month name
  const monthName = useMemo(() => 
    format(new Date(currentMonth + '-01'), 'MMMM yyyy'),
    [currentMonth]
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Ringkasan Finansial</CardTitle>
          <p className="text-sm text-muted-foreground">
            {monthName}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <SummaryCard 
              icon={ArrowUpIcon}
              bgClass="bg-green-50 border border-green-100"
              textClass="text-green-600"
              title="Total Pemasukan"
              amount={formatCurrency(totalIncome)}
            />
            
            <SummaryCard 
              icon={ArrowDownIcon}
              bgClass="bg-red-50 border border-red-100"
              textClass="text-red-600"
              title="Total Pengeluaran"
              amount={formatCurrency(totalExpense)}
            />
            
            <SummaryCard 
              icon={PiggyBankIcon}
              bgClass="bg-blue-50 border border-blue-100"
              textClass="text-blue-600"
              title="Total Tabungan"
              amount={formatCurrency(totalSavings)}
            />
            
            <SummaryCard 
              icon={TrendingUpIcon}
              bgClass="bg-emerald-50 border border-emerald-100"
              textClass="text-emerald-600"
              title="Sisa Dana"
              amount={formatCurrency(balance)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Tren Keuangan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Status keuangan bulan ini dibandingkan target
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar 
            label="Rasio Pengeluaran"
            percentage={expenseRatio}
            color="red-500"
            targetMessage="Target: maksimal 50% dari pemasukan"
          />
          
          <ProgressBar 
            label="Rasio Tabungan"
            percentage={savingsRatio}
            color="blue-500"
            targetMessage="Target: minimal 20% dari pemasukan"
          />
          
          <ProgressBar 
            label="Sisa Dana"
            percentage={balanceRatio}
            color="emerald-500"
            targetMessage="Target: minimal 30% dari pemasukan"
          />
        </CardContent>
      </Card>
    </div>
  );
});

export default FinancialSummary;
