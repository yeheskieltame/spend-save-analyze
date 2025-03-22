
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3Icon, HomeIcon, CreditCardIcon, Wallet2Icon, PiggyBankIcon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const SidebarContent = () => (
    <>
      <div className="p-6 pb-2 border-b">
        <Link to="/" className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Wallet2Icon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FinanceTracker</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1">by Yeheskiel Yunus Tame</span>
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
            onClick={() => isMobile && setSidebarOpen(false)}
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
            onClick={() => isMobile && setSidebarOpen(false)}
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
            onClick={() => isMobile && setSidebarOpen(false)}
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
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <CreditCardIcon className="h-4 w-4" />
            Hutang
          </NavLink>
        </div>
      </nav>
      
      <div className="p-4 border-t flex justify-center">
        <Link to="/add-habit" className="w-full" onClick={() => isMobile && setSidebarOpen(false)}>
          <Button className="w-full">
            + Tambah Transaksi
          </Button>
        </Link>
      </div>
    </>
  );
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="fixed inset-y-0 z-20 flex w-72 flex-col bg-card border-r">
          <SidebarContent />
        </aside>
      )}
      
      {/* Mobile Header and Sidebar */}
      {isMobile && (
        <>
          <div className="fixed top-0 left-0 right-0 z-20 h-16 bg-card border-b flex items-center px-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <Wallet2Icon className="h-5 w-5 text-primary" />
              <span className="font-bold">FinanceTracker</span>
            </div>
          </div>
        </>
      )}
      
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        !isMobile ? "ml-72" : "mt-16"
      )}>
        <div className="container max-w-5xl py-6 md:py-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
