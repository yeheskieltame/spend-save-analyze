
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
  
  const summaryData = [
    { name: 'Pengeluaran', value: totalExpense, color: '#ef4444' },
    { name: 'Tabungan', value: totalSavings, color: '#3b82f6' },
    { name: 'Sisa', value: balance > 0 ? balance : 0, color: '#10b981' },
  ].filter(item => item.value > 0);
  
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
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-100">
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
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-100">
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
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-100">
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
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100">
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
          <CardTitle className="text-lg font-medium">Distribusi Keuangan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Persentase alokasi dana Anda
          </p>
        </CardHeader>
        <CardContent>
          {summaryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summaryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={800}
                    animationBegin={0}
                  >
                    {summaryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="none" 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    layout="horizontal"
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Belum ada data finansial untuk ditampilkan
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;
