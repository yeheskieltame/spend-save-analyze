
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import FinancialSummary from '@/components/FinancialSummary';
import Recommendations from '@/components/Recommendations';
import { Button } from '@/components/ui/button';
import { PlusIcon, BarChart3Icon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancial } from '@/contexts/FinancialContext';
import { Skeleton } from '@/components/ui/skeleton';

// Menggunakan React.memo untuk mencegah render ulang jika props tidak berubah
const ActionButtons = memo(() => (
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
));

// Gunakan memo untuk komponen loading skeleton
const LoadingSkeleton = memo(() => (
  <div className="space-y-4">
    <Skeleton className="h-[200px] w-full rounded-lg" />
    <Skeleton className="h-[300px] w-full rounded-lg" />
  </div>
));

const Dashboard = () => {
  const { profile } = useAuth();
  const { loading } = useFinancial();
  
  // Get user's first name for greeting
  const firstName = profile?.full_name?.split(' ')[0] || 
                   profile?.username || 
                   'Pengguna';

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Halo, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Gambaran keseluruhan status keuangan dan rekomendasi pribadi Anda.
          </p>
        </div>
        
        <ActionButtons />
        
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <FinancialSummary />
            <Recommendations />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
