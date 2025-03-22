
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFinancial } from '@/contexts/FinancialContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, PiggyBankIcon, TrendingUpIcon } from 'lucide-react';
import { format } from 'date-fns';

const FinancialSummary = () => {
  const { totalIncome, totalExpense, totalSavings, currentMonth } = useFinancial();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const balance = totalIncome - totalExpense - totalSavings;
  
  // Format for current month name
  const monthName = format(new Date(currentMonth + '-01'), 'MMMM yyyy');

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
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-100 transition-all hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <ArrowUpIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Total Pemasukan</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-100 transition-all hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <ArrowDownIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">Total Pengeluaran</p>
                  <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpense)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-100 transition-all hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <PiggyBankIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Tabungan</p>
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalSavings)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100 transition-all hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <TrendingUpIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-800">Sisa Dana</p>
                  <p className="text-2xl font-bold text-emerald-700">{formatCurrency(balance)}</p>
                </div>
              </div>
            </div>
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
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium">Rasio Pengeluaran</p>
              <p className="text-sm font-medium">
                {totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: totalIncome > 0 
                    ? `${Math.min(100, (totalExpense / totalIncome) * 100)}%` 
                    : '0%'
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">Target: maksimal 50% dari pemasukan</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium">Rasio Tabungan</p>
              <p className="text-sm font-medium">
                {totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: totalIncome > 0 
                    ? `${Math.min(100, (totalSavings / totalIncome) * 100)}%` 
                    : '0%'
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">Target: minimal 20% dari pemasukan</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium">Sisa Dana</p>
              <p className="text-sm font-medium">
                {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: totalIncome > 0 
                    ? `${Math.min(100, (balance / totalIncome) * 100)}%` 
                    : '0%'
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">Target: minimal 30% dari pemasukan</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;
