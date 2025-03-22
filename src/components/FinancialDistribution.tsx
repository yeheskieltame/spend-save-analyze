
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from 'recharts';
import { useFinancial } from '@/contexts/FinancialContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const FinancialDistribution = () => {
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
  
  // Calculate percentages
  const total = summaryData.reduce((acc, item) => acc + item.value, 0);
  const dataWithPercentages = summaryData.map(item => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : "0",
  }));
  
  // Format for current month name
  const monthName = format(new Date(currentMonth + '-01'), 'MMMM yyyy');

  // Formatter for tooltip that shows percentages
  const customTooltipFormatter = (value: number, name: string, props: any) => {
    const percentage = props.payload.percentage;
    return [
      `${formatCurrency(value)} (${percentage}%)`, 
      name
    ];
  };

  return (
    <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Distribusi Keuangan</CardTitle>
        <p className="text-sm text-muted-foreground">
          {monthName} - Persentase alokasi dana Anda
        </p>
      </CardHeader>
      <CardContent>
        {dataWithPercentages.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithPercentages}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={800}
                  animationBegin={0}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }) => {
                    const radius = outerRadius + 20;
                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill="#888" 
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        fontSize="12"
                        fontWeight="500"
                      >
                        {name} ({percentage}%)
                      </text>
                    );
                  }}
                >
                  {dataWithPercentages.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="none" 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={customTooltipFormatter}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  }}
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
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          {dataWithPercentages.map((entry, index) => (
            <div 
              key={`legend-${index}`} 
              className="flex flex-col items-center p-3 border rounded-lg"
              style={{ borderColor: entry.color + '40', backgroundColor: entry.color + '10' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="font-medium">{entry.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{entry.percentage}%</p>
              <p className="font-semibold">{formatCurrency(entry.value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialDistribution;
