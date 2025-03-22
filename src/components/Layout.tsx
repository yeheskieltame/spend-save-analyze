
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3Icon, HomeIcon, CreditCardIcon, Wallet2Icon, PiggyBankIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn(
        "fixed inset-y-0 z-20 flex w-72 flex-col transition-all duration-300 ease-in-out bg-card border-r",
        isMobile && "-translate-x-full"
      )}>
        <div className="p-6 pb-2 border-b">
          <Link to="/" className="flex items-center gap-2">
            <Wallet2Icon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FinanceTracker</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-auto py-6 px-3">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold px-3 py-2 text-muted-foreground">
              Menu Utama
            </h3>
            
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <HomeIcon className="h-4 w-4" />
              Ringkasan
            </NavLink>
            
            <NavLink 
              to="/analysis" 
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <BarChart3Icon className="h-4 w-4" />
              Analisis
            </NavLink>
            
            <NavLink 
              to="/savings" 
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <PiggyBankIcon className="h-4 w-4" />
              Tabungan
            </NavLink>
            
            <NavLink 
              to="/debt-analysis" 
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <CreditCardIcon className="h-4 w-4" />
              Hutang
            </NavLink>
          </div>
        </nav>
        
        <div className="p-4 border-t flex justify-center">
          <Link to="/add-habit" className="w-full">
            <Button className="w-full">
              + Tambah Transaksi
            </Button>
          </Link>
        </div>
      </aside>
      
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        !isMobile && "ml-72"
      )}>
        <div className="container max-w-5xl py-6 md:py-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
