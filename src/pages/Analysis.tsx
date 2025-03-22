
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HabitList from '@/components/HabitList';
import FinancialDistribution from '@/components/FinancialDistribution';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';

const Analysis = () => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Analisis Finansial</h1>
          <Button variant="ghost" onClick={handleBackClick} className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Ringkasan
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Analisis distribusi keuangan dan daftar kebiasaan finansial Anda.
        </p>
        
        <div className="flex justify-end">
          <Link to="/add-habit">
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Tambah Kebiasaan
            </Button>
          </Link>
        </div>
        
        <FinancialDistribution />
        
        <HabitList />
      </div>
    </Layout>
  );
};

export default Analysis;
