
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  HomeIcon, 
  PiggyBankIcon, 
  ListTodoIcon, 
  BarChart3Icon, 
  MenuIcon, 
  XIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 transition-transform duration-300",
        active ? "text-primary-foreground" : "text-sidebar-foreground",
        "group-hover:scale-110"
      )} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {sidebarOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </Button>
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-0 z-40 lg:relative transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:w-64 bg-sidebar backdrop-blur-lg border-r border-sidebar-border",
          "bg-sidebar/90 backdrop-blur-md"
        )}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="pb-6 mb-6 border-b border-sidebar-border">
            <h1 className="text-2xl font-bold tracking-tight">FinancialHabit</h1>
            <h2 className="text-2xl font-bold tracking-tight">by kiel tame</h2>
            <p className="text-sidebar-foreground text-sm mt-1">Kelola kebiasaan finansial Anda</p>
          </div>
          
          <nav className="space-y-1 flex-1">
            <SidebarItem 
              icon={HomeIcon} 
              label="Dashboard" 
              to="/" 
              active={location.pathname === '/'} 
            />
            <SidebarItem 
              icon={ListTodoIcon} 
              label="Kebiasaan" 
              to="/dashboard" 
              active={location.pathname === '/dashboard'} 
            />
            <SidebarItem 
              icon={BarChart3Icon} 
              label="Analisis" 
              to="/dashboard" 
              active={false} 
            />
            <SidebarItem 
              icon={PiggyBankIcon} 
              label="Tabungan" 
              to="/dashboard" 
              active={false} 
            />
          </nav>
          
          <div className="pt-6 mt-6 border-t border-sidebar-border">
            <div className="glass-card p-4 rounded-xl animate-float">
              <h3 className="font-medium text-sm">Tips Keuangan</h3>
              <p className="text-xs text-sidebar-foreground mt-2">
                Catat pengeluaran hari ini untuk kebiasaan finansial yang lebih baik.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
