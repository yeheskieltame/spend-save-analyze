import React, { useState, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, BarChart2, PiggyBank, Plus, Settings, LogOut, Github, Linkedin, Instagram, Mail } from 'lucide-react';
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

const NavItem = memo(({ href, icon: Icon, label }: NavItemProps) => {
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
});

const Layout = memo(({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      toast.error("Gagal logout");
    }
  }, [signOut]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const navigation = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/analysis', icon: BarChart2, label: 'Analisis' },
    { href: '/savings', icon: PiggyBank, label: 'Tabungan' },
    { href: '/add-habit', icon: Plus, label: 'Tambah Habit' },
    { href: '/settings', icon: Settings, label: 'Pengaturan' },
  ];

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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
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
          {user?.email && (
            <div className="mx-auto mb-6 px-4 truncate text-center">
              <span className="text-sm font-medium text-muted-foreground">{user.email}</span>
            </div>
          )}
          <ul className="space-y-0.5">
            {navigation.map((item) => (
              <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
            ))}
          </ul>
        </aside>

        {isMobile && (
          <div className={`fixed inset-0 z-50 bg-background/80 backdrop-blur flex-col gap-4 overflow-auto px-6 py-10 text-sm shadow-lg transition-all duration-300 ${isOpen ? 'flex' : 'hidden'}`}>
            <div className="flex items-center justify-between">
              {user?.email && (
                <span className="truncate max-w-[200px] text-sm">{user.email}</span>
              )}
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        )}

        <main className="flex-1 flex flex-col">
          {isMobile && (
            <div className="border-b">
              <div className="container flex h-14 items-center">
                <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={toggleMenu}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
                <span className="font-semibold">
                  {navigation.find(item => item.href === pathname)?.label || 'Dashboard'}
                </span>
              </div>
            </div>
          )}
          <div className="container py-10 flex-1">{children}</div>
          
          <footer className="py-6 border-t bg-secondary/30">
            <div className="container">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium">Dikembangkan oleh Yeheskiel Yunus Tame</p>
                  <p className="text-xs text-muted-foreground">Dibuat Maret 2025</p>
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Github">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
});

export default Layout;
