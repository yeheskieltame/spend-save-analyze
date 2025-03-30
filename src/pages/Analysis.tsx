
import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HabitList from '@/components/HabitList';
import FinancialDistribution from '@/components/FinancialDistribution';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';

// Header yang akan di-memoize
const AnalysisHeader = memo(({ onBackClick }: { onBackClick: () => void }) => (
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold tracking-tight">Analisis Finansial</h1>
    <Button variant="ghost" onClick={onBackClick} className="gap-2">
      <ArrowLeftIcon className="h-4 w-4" />
      Kembali ke Ringkasan
    </Button>
  </div>
));

// ActionButton yang akan di-memoize
const ActionButton = memo(() => (
  <div className="flex justify-end">
    <Link to="/add-habit">
      <Button className="gap-2">
        <PlusIcon className="h-4 w-4" />
        Tambah Kebiasaan
      </Button>
    </Link>
  </div>
));

const Analysis = () => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="space-y-8">
        <AnalysisHeader onBackClick={handleBackClick} />
        
        <p className="text-muted-foreground">
          Analisis distribusi keuangan dan daftar kebiasaan finansial Anda.
        </p>
        
        <ActionButton />
        
        <FinancialDistribution />
        
        <HabitList />
      </div>
    </Layout>
  );
};

export default Analysis;
