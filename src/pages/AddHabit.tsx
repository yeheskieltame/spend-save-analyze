
import React, { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HabitForm from '@/components/HabitForm';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useFinancial } from '@/contexts/FinancialContext';

// Komponen header yang dipisahkan dengan memo
const PageHeader = memo(({ onBackClick }: { onBackClick: () => void }) => (
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold tracking-tight">Tambah Kebiasaan Finansial</h1>
    <Button variant="ghost" onClick={onBackClick} className="gap-2">
      <ArrowLeftIcon className="h-4 w-4" />
      Kembali
    </Button>
  </div>
));

const AddHabit = () => {
  const navigate = useNavigate();
  const { refreshData } = useFinancial();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSuccessCallback = async () => {
    setIsSubmitting(true);
    try {
      // Ensure data is refreshed
      await refreshData();
      toast.success("Kebiasaan finansial berhasil ditambahkan!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader onBackClick={handleBackClick} />
        
        <p className="text-muted-foreground">
          Catat kebiasaan finansial Anda untuk memantau perkembangan keuangan Anda.
        </p>
        
        <div className="max-w-xl mx-auto">
          <HabitForm onSuccessCallback={handleSuccessCallback} />
        </div>
      </div>
    </Layout>
  );
};

export default AddHabit;
