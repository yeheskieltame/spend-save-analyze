
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, DollarSign, ArrowUpIcon, ArrowDownIcon, PiggyBankIcon, CreditCardIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinancial, HabitType } from '@/contexts/FinancialContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nama harus minimal 3 karakter' }),
  type: z.enum(['income', 'expense', 'savings', 'debt'], {
    required_error: 'Pilih tipe kebiasaan finansial',
  }),
  source: z.enum(['current', 'savings']).optional(),
  amount: z.coerce.number().positive({ message: 'Jumlah harus positif' }),
  date: z.date({
    required_error: 'Pilih tanggal',
  }),
});

interface HabitFormProps {
  onSuccessCallback?: () => void;
}

const HabitForm = ({ onSuccessCallback }: HabitFormProps) => {
  const { addHabit } = useFinancial();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'income',
      amount: 0,
      date: new Date(),
    },
  });

  // Mendapatkan nilai type saat ini untuk tampilan kondisional
  const currentType = form.watch('type');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addHabit({
      name: values.name,
      type: values.type as HabitType,
      amount: values.amount,
      date: format(values.date, 'yyyy-MM-dd'),
      source: values.source || 'current',
    });
    form.reset();
    
    if (onSuccessCallback) {
      onSuccessCallback();
    }
  };

  return (
    <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Tambah Kebiasaan Finansial</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Gaji bulanan, Belanja, dll." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-4 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="income"
                            id="income"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <label
                          htmlFor="income"
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <ArrowUpIcon className="mb-3 h-6 w-6 text-green-500" />
                          <span className="text-sm font-medium">Pemasukan</span>
                        </label>
                      </FormItem>
                      
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="expense"
                            id="expense"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <label
                          htmlFor="expense"
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <ArrowDownIcon className="mb-3 h-6 w-6 text-red-500" />
                          <span className="text-sm font-medium">Pengeluaran</span>
                        </label>
                      </FormItem>
                      
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="savings"
                            id="savings"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <label
                          htmlFor="savings"
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <PiggyBankIcon className="mb-3 h-6 w-6 text-blue-500" />
                          <span className="text-sm font-medium">Tabungan</span>
                        </label>
                      </FormItem>
                      
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="debt"
                            id="debt"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <label
                          htmlFor="debt"
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <CreditCardIcon className="mb-3 h-6 w-6 text-orange-500" />
                          <span className="text-sm font-medium">Hutang</span>
                        </label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {currentType === 'expense' && (
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sumber Dana</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || 'current'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih sumber dana" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="current">Uang Pegangan Saat Ini</SelectItem>
                        <SelectItem value="savings">Tabungan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Tambah Kebiasaan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HabitForm;
