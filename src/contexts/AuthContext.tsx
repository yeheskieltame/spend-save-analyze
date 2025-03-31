
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { AuthContextType } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    setUser,
    session,
    setSession,
    profile,
    setProfile,
    loading,
    setLoading, // Make sure we destructure setLoading from useAuthActions
    fetchProfile,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    updateTheme
  } = useAuthActions();

  useEffect(() => {
    console.log("Setting up auth state change listener");
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
          window.location.href = '/auth';
        }
      }
    }).finally(() => {
      // Ensure loading state is updated regardless of outcome
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, setLoading, setProfile, setSession, setUser]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
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
  }), [
    user, 
    session, 
    profile, 
    signIn, 
    signUp, 
    signOut, 
    signInWithGoogle, 
    loading, 
    updateProfile, 
    updateTheme
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
