
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground">
          Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <div>
          <Link to={user ? "/dashboard" : "/"}>
            <Button className="gap-2">
              <HomeIcon className="h-4 w-4" />
              {user ? "Kembali ke Dashboard" : "Kembali ke Beranda"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
