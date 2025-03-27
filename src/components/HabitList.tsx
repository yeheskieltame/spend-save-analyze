import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  PiggyBankIcon, 
  TrashIcon, 
  SearchIcon,
  CalendarIcon,
  FilterIcon,
  CreditCardIcon,
  DownloadIcon,
  RefreshCwIcon
} from 'lucide-react';
import { toast } from "sonner";

import { useFinancial, FinancialHabit, HabitType } from '@/contexts/FinancialContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/ui/loading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type IconMapping = {
  [key in HabitType]: React.ReactNode;
};

const typeIcons: IconMapping = {
  income: <ArrowUpIcon className="w-4 h-4 text-green-500" />,
  expense: <ArrowDownIcon className="w-4 h-4 text-red-500" />,
  savings: <PiggyBankIcon className="w-4 h-4 text-blue-500" />,
  debt: <CreditCardIcon className="w-4 h-4 text-orange-500" />
};

const typeLabels: Record<HabitType, string> = {
  income: 'Pemasukan',
  expense: 'Pengeluaran',
  savings: 'Tabungan',
  debt: 'Hutang'
};

const HabitList = () => {
  const { 
    habits, 
    deleteHabit, 
    currentMonth, 
    setCurrentMonth, 
    availableMonths, 
    availableYears, 
    filterByYear,
    refreshData,
    loading
  } = useFinancial();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(() => {
    const date = new Date();
    return `${date.getFullYear()}`;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      await refreshData();
    };
    
    fetchInitialData();
  }, [refreshData]);
  
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast.success("Data berhasil diperbarui");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Gagal memperbarui data");
    } finally {
      setIsRefreshing(false);
    }
  };
  
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

  const downloadReport = () => {
    const yearHabits = filterByYear(selectedYear);
    
    const habitsByMonth: Record<string, FinancialHabit[]> = {};
    yearHabits.forEach(habit => {
      const month = habit.date.substring(0, 7); // YYYY-MM
      if (!habitsByMonth[month]) {
        habitsByMonth[month] = [];
      }
      habitsByMonth[month].push(habit);
    });
    
    const monthlyTotals: Record<string, { income: number; expense: number; savings: number; debt: number }> = {};
    Object.keys(habitsByMonth).forEach(month => {
      monthlyTotals[month] = habitsByMonth[month].reduce(
        (acc, habit) => {
          if (habit.type === 'income') acc.income += habit.amount;
          else if (habit.type === 'expense') acc.expense += habit.amount;
          else if (habit.type === 'savings') acc.savings += habit.amount;
          else if (habit.type === 'debt') acc.debt += habit.amount;
          return acc;
        },
        { income: 0, expense: 0, savings: 0, debt: 0 }
      );
    });
    
    let reportContent = `LAPORAN FINANSIAL TAHUN ${selectedYear}\n\n`;
    reportContent += `Tanggal Unduh: ${format(new Date(), 'dd MMMM yyyy')}\n\n`;
    
    const yearlyTotals = Object.values(monthlyTotals).reduce(
      (acc, monthTotal) => {
        acc.income += monthTotal.income;
        acc.expense += monthTotal.expense;
        acc.savings += monthTotal.savings;
        acc.debt += monthTotal.debt;
        return acc;
      },
      { income: 0, expense: 0, savings: 0, debt: 0 }
    );
    
    reportContent += "RINGKASAN TAHUNAN\n";
    reportContent += `Total Pemasukan: ${formatCurrency(yearlyTotals.income)}\n`;
    reportContent += `Total Pengeluaran: ${formatCurrency(yearlyTotals.expense)}\n`;
    reportContent += `Total Tabungan: ${formatCurrency(yearlyTotals.savings)}\n`;
    reportContent += `Total Hutang: ${formatCurrency(yearlyTotals.debt)}\n\n`;
    
    reportContent += "DETAIL BULANAN\n";
    Object.keys(habitsByMonth).sort().forEach(month => {
      const monthName = format(new Date(month + '-01'), 'MMMM yyyy');
      reportContent += `\n--- ${monthName} ---\n`;
      
      const monthTotal = monthlyTotals[month];
      reportContent += `Pemasukan: ${formatCurrency(monthTotal.income)}\n`;
      reportContent += `Pengeluaran: ${formatCurrency(monthTotal.expense)}\n`;
      reportContent += `Tabungan: ${formatCurrency(monthTotal.savings)}\n`;
      reportContent += `Hutang: ${formatCurrency(monthTotal.debt)}\n\n`;
      
      habitsByMonth[month].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .forEach(habit => {
          const formattedDate = format(new Date(habit.date), 'dd/MM/yyyy');
          reportContent += `${formattedDate} - ${habit.name} (${typeLabels[habit.type]}): ${formatCurrency(habit.amount)}\n`;
        });
      
      reportContent += "\n";
    });
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${selectedYear}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast?.success(`Laporan keuangan tahun ${selectedYear} berhasil diunduh!`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kebiasaan ini?")) {
      await deleteHabit(id);
    }
  };

  return (
    <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Daftar Kebiasaan Finansial</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCwIcon className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span>Refresh</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <DownloadIcon className="h-4 w-4" />
                <span>Unduh Laporan</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unduh Laporan Keuangan</DialogTitle>
                <DialogDescription>
                  Pilih tahun untuk mengunduh laporan keuangan lengkap.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.length ? (
                        availableYears.map(year => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={selectedYear}>
                          {selectedYear}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={downloadReport} className="gap-2 w-full">
                  <DownloadIcon className="h-4 w-4" />
                  <span>Unduh Laporan Tahun {selectedYear}</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
        
        {loading ? (
          <Loading text="Memuat data..." fullScreen />
        ) : (
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
                          habit.type === 'expense' ? "text-red-600" : 
                          habit.type === 'savings' ? "text-blue-600" : "text-orange-600"
                        )}>
                          {formatCurrency(habit.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(habit.id)}
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
        )}
      </CardContent>
    </Card>
  );
};

export default HabitList;
