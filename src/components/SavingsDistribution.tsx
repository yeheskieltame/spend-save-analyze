
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFinancial } from '@/contexts/FinancialContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Legend, Tooltip } from 'recharts';

export const SavingsDistribution: React.FC = () => {
  const { habits, filterByMonth, currentMonth } = useFinancial();
  const [activeIndex, setActiveIndex] = useState(0);

  // Mendapatkan data tabungan dan mengelompokkan berdasarkan nama
  const savingsData = filterByMonth(currentMonth)
    .filter(habit => habit.type === 'savings')
    .reduce((acc, habit) => {
      const existing = acc.find(item => item.name === habit.name);
      if (existing) {
        existing.value += habit.amount;
      } else {
        acc.push({
          name: habit.name,
          value: habit.amount
        });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  // Menghitung total untuk persentase
  const total = savingsData.reduce((sum, item) => sum + item.value, 0);

  // Jika tidak ada data, tampilkan pesan
  if (savingsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <p className="text-muted-foreground">Belum ada data tabungan</p>
      </div>
    );
  }

  // Warna untuk chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FCBAD3', '#FB8D62'];

  // Fungsi untuk menampilkan label persentase
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={savingsData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={renderCustomizedLabel}
            onMouseEnter={onPieEnter}
          >
            {savingsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Jumlah']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
