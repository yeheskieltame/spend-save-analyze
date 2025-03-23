
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3Icon, HomeIcon, CreditCardIcon, Wallet2Icon, 
  PiggyBankIcon, Menu, X, Settings, LogOut, Moon, Sun, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, signOut, updateTheme } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  // Apply theme from profile
  useEffect(() => {
    if (profile?.theme) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profile.theme);
    }
  }, [profile?.theme]);
  
  const handleSignOut = () => {
    signOut();
  };
  
  const handleThemeToggle = () => {
    const newTheme = profile?.theme === 'dark' ? 'light' : 'dark';
    updateTheme(newTheme);
  };
  
  const navigateToSettings = () => {
    navigate('/settings');
  };
  
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };
  
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
      
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar>
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.full_name || profile?.username || user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[140px]">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-auto py-2 px-3">
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
          
          <NavLink 
            to="/settings" 
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Pengaturan
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
            
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {profile?.full_name || profile?.username || user?.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleThemeToggle}>
                    {profile?.theme === 'dark' ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    {profile?.theme === 'dark' ? 'Tema Terang' : 'Tema Gelap'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={navigateToSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
