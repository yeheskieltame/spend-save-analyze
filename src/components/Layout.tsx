import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, BarChart2, PiggyBank, Plus, Settings, LogOut, ChevronRight } from 'lucide-react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserGuideButton } from '@/components/UserGuide';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label }) => {
  const { pathname } = useLocation();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        to={href}
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-secondary-foreground",
          isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
        )}
      >
        <Icon className="mr-2 h-4 w-4" />
        <span>{label}</span>
      </Link>
    </li>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Berhasil logout");
      navigate('/');
    } catch (error) {
      toast.error("Gagal logout");
      console.error(error);
    }
  };

  const navigation = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/analysis', icon: BarChart2, label: 'Analisis' },
    { href: '/savings', icon: PiggyBank, label: 'Tabungan' },
    { href: '/add-habit', icon: Plus, label: 'Tambah Habit' },
    { href: '/settings', icon: Settings, label: 'Pengaturan' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/dashboard" className="flex items-center font-semibold">
            <span className="hidden sm:inline-block">
              Financial Habit Tracker
            </span>
            <span className="sm:hidden">FHT</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <UserGuideButton />
              {user ? (
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Logout
                </Button>
              ) : (
                pathname !== '/auth' && (
                  <Link to="/auth">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-secondary py-10 sm:flex">
          <Link to="/settings" className="mx-auto mb-6">
            {user?.email}
          </Link>
          <ul className="space-y-0.5">
            {navigation.map((item) => (
              <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
            ))}
          </ul>
        </aside>

        {isMobile && (
          <div className={`fixed inset-0 z-50 bg-background/80 backdrop-blur flex-col gap-4 overflow-auto px-6 py-10 text-sm shadow-lg transition-all duration-300 ${isOpen ? 'flex' : 'hidden'}`}>
            <div className="flex items-center justify-between">
              <Link to="/settings" className="">
                {user?.email}
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleMenu}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <ul className="space-y-0.5">
              {navigation.map((item) => (
                <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
              ))}
            </ul>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
        )}

        <main className="flex-1">
          {isMobile && (
            <div className="border-b">
              <div className="container flex h-14 items-center">
                <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={toggleMenu}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
                <Link to="/dashboard" className="font-semibold">
                  {navigation.find(item => item.href === pathname)?.label || 'Dashboard'}
                </Link>
              </div>
            </div>
          )}
          <div className="container py-10">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
