
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="glass-card p-8 rounded-xl border border-muted">
          <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
          <p className="text-xl text-foreground mb-6">Halaman tidak ditemukan</p>
          <p className="text-muted-foreground mb-6">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Silahkan kembali ke halaman utama.
          </p>
          <Link to="/">
            <Button className="gap-2">
              <HomeIcon className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
