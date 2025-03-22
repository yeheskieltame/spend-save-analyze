
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinancial } from '@/contexts/FinancialContext';
import { SavingsList } from '@/components/SavingsList';
import { SavingsDistribution } from '@/components/SavingsDistribution';
import { Button } from '@/components/ui/button';
import { PlusIcon, BarChart3Icon } from 'lucide-react';

const Savings = () => {
  const { totalSavings } = useFinancial();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Tabungan</h1>
          <p className="text-muted-foreground mt-2">
            Pantau perkembangan tabungan dan pengeluaran dari tabungan Anda secara detail.
          </p>
        </div>
        
        <div className="flex justify-between gap-4 flex-wrap">
          <Link to="/add-habit">
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Tambah Tabungan
            </Button>
          </Link>
          
          <Link to="/analysis">
            <Button variant="outline" className="gap-2">
              <BarChart3Icon className="h-4 w-4" />
              Lihat Analisis
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tabungan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {totalSavings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Akumulasi semua tabungan Anda</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pertumbuhan Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">+5%</div>
              <p className="text-xs text-muted-foreground mt-1">Dibandingkan bulan lalu</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Target Tercapai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground mt-1">Dari target tahunan</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Penarikan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">Rp 500.000</div>
              <p className="text-xs text-muted-foreground mt-1">Total penarikan bulan ini</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Distribusi Tabungan</CardTitle>
            </CardHeader>
            <CardContent>
              <SavingsDistribution />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Riwayat Tabungan</CardTitle>
              <Link to="/add-habit">
                <Button variant="ghost" size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Tambah
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <SavingsList />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Savings;
