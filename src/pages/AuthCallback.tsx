
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Extract handleRedirect to useCallback to prevent unnecessary re-renders
  const handleRedirect = useCallback(async () => {
    // Handle OAuth redirect
    try {
      console.log("Auth callback: Starting to handle redirect");
      
      // Get the current URL hash and search parameters
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);
      
      // Log information to help diagnose the issue
      console.log("URL hash:", window.location.hash);
      console.log("URL search:", window.location.search);
      
      // Exchange the code for a session, this should trigger our auth state change listener
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error handling OAuth callback:', error);
        setError(`Auth error: ${error.message}`);
        toast.error("Gagal login: " + error.message);
        setTimeout(() => navigate('/auth'), 3000);
        return;
      }

      if (data?.session) {
        // Successfully authenticated
        console.log("Auth callback: Session found, login successful");
        
        // Enable realtime for financial_habits table
        const userId = data.session.user.id;
        console.log("Enabling realtime for financial_habits for user", userId);
        
        // We don't await this since it's not critical for navigation
        supabase.channel('public:financial_habits')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'financial_habits',
            filter: `user_id=eq.${userId}`
          }, (payload) => {
            console.log('Financial habits change received:', payload);
          })
          .subscribe((status) => {
            console.log('Financial habits realtime status:', status);
          });
        
        toast.success("Login berhasil!");
        // Use replace instead of push to avoid adding to history stack
        navigate('/dashboard', { replace: true });
      } else {
        // No session, redirect back to login
        console.log("Auth callback: No session found");
        setError("Tidak ada sesi yang ditemukan");
        toast.error("Gagal login: Tidak ada sesi yang ditemukan");
        setTimeout(() => navigate('/auth', { replace: true }), 3000);
      }
    } catch (err) {
      console.error("Unexpected error during auth:", err);
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      setTimeout(() => navigate('/auth', { replace: true }), 3000);
    }
  }, [navigate]);

  useEffect(() => {
    // Add more debugging console logs
    console.log("AuthCallback component mounted");
    console.log("Current URL:", window.location.href);
    
    handleRedirect();
  }, [handleRedirect]);

  // Refactor error display and loading into separate components
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4 mx-auto w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium">Terjadi Kesalahan</h2>
          <p className="text-muted-foreground">{error}</p>
          <p className="mt-4 text-sm">Mengarahkan ke halaman login dalam beberapa detik...</p>
        </div>
      </div>
    );
  }

  return (
    <Loading 
      size="lg" 
      text="Mengautentikasi... Mohon tunggu sebentar" 
      fullScreen={true} 
    />
  );
};

export default AuthCallback;
