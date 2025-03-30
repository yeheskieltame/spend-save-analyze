
import { useCallback, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Profile } from '@/types/auth';

export function useAuthActions() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (userId: string) => {
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
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
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
  }, [navigate]);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
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
  }, []);

  const signInWithGoogle = useCallback(async () => {
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
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast.error(error.message || "Gagal login dengan Google, silakan coba lagi");
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log("Signing out...");
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Clear the user and session state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast.success("Logout berhasil!");
      navigate('/');
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "Gagal logout, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const updateProfile = useCallback(async (data: Partial<Profile>) => {
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
  }, [user]);

  const updateTheme = useCallback(async (theme: 'light' | 'dark') => {
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
  }, [user]);

  return {
    user,
    setUser,
    session,
    setSession,
    profile, 
    setProfile,
    loading,
    setLoading,
    fetchProfile,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    updateTheme
  };
}
