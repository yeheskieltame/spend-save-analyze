
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      // Handle OAuth redirect
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error handling OAuth callback:', error);
        navigate('/auth');
        return;
      }

      if (data?.session) {
        // Successfully authenticated
        navigate('/dashboard');
      } else {
        // No session, redirect back to login
        navigate('/auth');
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-lg font-medium">Mengautentikasi...</h2>
        <p className="text-muted-foreground">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
};

export default AuthCallback;
