
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HabitForm from '@/components/HabitForm';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

const AddHabit = () => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Tambah Kebiasaan Finansial</h1>
          <Button variant="ghost" onClick={handleBackClick} className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Catat kebiasaan finansial Anda untuk memantau perkembangan keuangan Anda.
        </p>
        
        <div className="max-w-xl mx-auto">
          <HabitForm onSuccessCallback={() => navigate('/dashboard')} />
        </div>
      </div>
    </Layout>
  );
};

export default AddHabit;
