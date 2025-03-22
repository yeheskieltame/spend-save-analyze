
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import FinancialSummary from '@/components/FinancialSummary';
import Recommendations from '@/components/Recommendations';
import { Button } from '@/components/ui/button';
import { PlusIcon, BarChart3Icon } from 'lucide-react';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ringkasan Finansial</h1>
          <p className="text-muted-foreground mt-2">
            Gambaran keseluruhan status keuangan dan rekomendasi pribadi Anda.
          </p>
        </div>
        
        <div className="flex justify-between gap-4 flex-wrap">
          <Link to="/add-habit">
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Tambah Kebiasaan
            </Button>
          </Link>
          
          <Link to="/analysis">
            <Button variant="outline" className="gap-2">
              <BarChart3Icon className="h-4 w-4" />
              Lihat Analisis
            </Button>
          </Link>
        </div>
        
        <FinancialSummary />
        
        <Recommendations />
      </div>
    </Layout>
  );
};

export default Dashboard;
