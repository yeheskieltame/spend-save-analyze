
import React from 'react';
import { useFinancial } from '@/contexts/FinancialContext';
import { formatDate } from '@/lib/formatDate';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PiggyBankIcon, ArrowDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SavingsList: React.FC = () => {
  const { habits, filterByMonth, currentMonth } = useFinancial();
  
  // Filter hanya tipe tabungan
  const savingsHabits = filterByMonth(currentMonth).filter(
    habit => habit.type === 'savings'
  );

  if (savingsHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <PiggyBankIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-1">Belum Ada Tabungan</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Anda belum menambahkan tabungan apapun bulan ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savingsHabits.map((saving) => (
            <TableRow key={saving.id}>
              <TableCell className="font-medium">{formatDate(saving.date)}</TableCell>
              <TableCell>{saving.name}</TableCell>
              <TableCell className="text-right">
                Rp {saving.amount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
