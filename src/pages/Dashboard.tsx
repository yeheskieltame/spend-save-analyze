
import React from 'react';
import Layout from '@/components/Layout';
import HabitForm from '@/components/HabitForm';
import HabitList from '@/components/HabitList';
import FinancialSummary from '@/components/FinancialSummary';
import Recommendations from '@/components/Recommendations';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kebiasaan Finansial</h1>
          <p className="text-muted-foreground mt-2">
            Kelola dan pantau kebiasaan finansial Anda untuk keuangan yang lebih sehat.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <HabitForm />
          </div>
          <div className="md:col-span-2">
            <Recommendations />
          </div>
        </div>
        
        <FinancialSummary />
        
        <HabitList />
      </div>
    </Layout>
  );
};

export default Dashboard;
