
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  theme: 'light' | 'dark';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  updateTheme: (theme: 'light' | 'dark') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get current session - this will respect the persistSession setting
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.email || 'No session');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      } else {
        // If we're on a protected route and there's no session, redirect to auth
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '/auth' && !currentPath.startsWith('/auth/')) {
          navigate('/auth');
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }

      toast.success("Login berhasil!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Gagal login, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username,
            full_name: username,
          }
        }
      });
      
      if (error) {
        throw error;
      }

      toast.success("Registrasi berhasil! Silakan cek email Anda untuk konfirmasi.");
    } catch (error: any) {
      toast.error(error.message || "Gagal registrasi, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      console.log("Starting Google sign in process");
      
      // Get the current origin for the redirect URL
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log("Using redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
        throw error;
      }
      
      // Note: The user will be redirected to Google's auth page
      // and then back to the redirectTo URL, so no need to navigate here
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast.error(error.message || "Gagal login dengan Google, silakan coba lagi");
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Clear the user and session state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      
      navigate('/');
      toast.success("Logout berhasil!");
    } catch (error: any) {
      toast.error(error.message || "Gagal logout, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }

      // Update the profile state immediately for real-time feedback
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast.success("Profil berhasil diperbarui!");
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (theme: 'light' | 'dark') => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ theme })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }

      // Update the profile state immediately for real-time feedback
      setProfile(prev => prev ? { ...prev, theme } : null);
      
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      
      toast.success(`Tema ${theme === 'dark' ? 'gelap' : 'terang'} berhasil diterapkan!`);
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui tema, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    loading,
    updateProfile,
    updateTheme,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
