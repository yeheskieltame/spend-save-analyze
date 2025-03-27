
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      // Handle OAuth redirect
      try {
        console.log("Auth callback: Starting to handle redirect");
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
          toast.success("Login berhasil!");
          navigate('/dashboard');
        } else {
          // No session, redirect back to login
          console.log("Auth callback: No session found");
          setError("Tidak ada sesi yang ditemukan");
          toast.error("Gagal login: Tidak ada sesi yang ditemukan");
          setTimeout(() => navigate('/auth'), 3000);
        }
      } catch (err) {
        console.error("Unexpected error during auth:", err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {error ? (
          <>
            <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4 mx-auto w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="mt-4 text-sm">Mengarahkan ke halaman login dalam beberapa detik...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-lg font-medium">Mengautentikasi...</h2>
            <p className="text-muted-foreground">Mohon tunggu sebentar</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
