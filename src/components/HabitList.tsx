
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  PiggyBankIcon, 
  TrashIcon, 
  SearchIcon,
  CalendarIcon,
  FilterIcon
} from 'lucide-react';

import { useFinancial, FinancialHabit, HabitType } from '@/contexts/FinancialContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type IconMapping = {
  [key in HabitType]: React.ReactNode;
};

const typeIcons: IconMapping = {
  income: <ArrowUpIcon className="w-4 h-4 text-green-500" />,
  expense: <ArrowDownIcon className="w-4 h-4 text-red-500" />,
  savings: <PiggyBankIcon className="w-4 h-4 text-blue-500" />
};

const typeLabels: Record<HabitType, string> = {
  income: 'Pemasukan',
  expense: 'Pengeluaran',
  savings: 'Tabungan'
};

const HabitList = () => {
  const { habits, deleteHabit, currentMonth, setCurrentMonth, availableMonths } = useFinancial();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredHabits = habits
    .filter(habit => habit.date.startsWith(currentMonth))
    .filter(habit => 
      habit.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      typeLabels[habit.type].toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const sortedHabits = [...filteredHabits].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Daftar Kebiasaan Finansial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kebiasaan..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <Select
              value={currentMonth}
              onValueChange={setCurrentMonth}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Pilih bulan" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.length ? (
                  availableMonths.map(month => (
                    <SelectItem key={month} value={month}>
                      {format(new Date(month + '-01'), 'MMMM yyyy')}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={currentMonth}>
                    {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipe</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tanggal</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Jumlah</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedHabits.length > 0 ? (
                  sortedHabits.map((habit) => (
                    <tr 
                      key={habit.id} 
                      className="bg-card transition-colors hover:bg-muted/30 animate-scale-in"
                    >
                      <td className="px-4 py-3 text-sm">{habit.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          {typeIcons[habit.type]}
                          <span>{typeLabels[habit.type]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{format(new Date(habit.date), 'dd MMMM yyyy')}</td>
                      <td className={cn(
                        "px-4 py-3 text-sm text-right font-medium",
                        habit.type === 'income' ? "text-green-600" : 
                        habit.type === 'expense' ? "text-red-600" : "text-blue-600"
                      )}>
                        {formatCurrency(habit.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteHabit(habit.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      {searchQuery 
                        ? "Tidak ada kebiasaan yang sesuai dengan pencarian" 
                        : "Belum ada kebiasaan finansial untuk bulan ini"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitList;
