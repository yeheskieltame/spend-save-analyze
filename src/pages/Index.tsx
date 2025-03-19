
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, BarChart3Icon, ListTodoIcon, PiggyBankIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
      <CardContent className="p-6">
        <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  return (
    <Layout>
      <div className="space-y-16">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Cerdas • Sederhana • Efektif
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Kelola Kebiasaan Finansial Anda
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Kelola Kebiasaan Finansial Anda
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Catat, pantau, dan analisis keuangan Anda dengan mudah untuk mencapai tujuan keuangan yang lebih baik.
          </p>
          <div className="pt-4">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 group">
                Mulai Sekarang
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FeatureCard
            icon={ListTodoIcon}
            title="Manajemen Kebiasaan"
            description="Tambah, hapus, dan lihat semua kebiasaan finansial Anda dalam satu tempat yang terorganisir."
          />
          <FeatureCard
            icon={BarChart3Icon}
            title="Analisis Visual"
            description="Lihat ringkasan dan distribusi keuangan Anda melalui grafik yang mudah dipahami."
          />
          <FeatureCard
            icon={PiggyBankIcon}
            title="Rekomendasi Cerdas"
            description="Dapatkan saran dan tips berdasarkan pola pengeluaran dan tabungan Anda."
          />
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Mengapa Menggunakan Aplikasi Ini?</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-primary/20 p-1 rounded-full mt-1">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Transparansi Keuangan</strong> – Lihat semua aktivitas finansial dalam satu dashboard.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/20 p-1 rounded-full mt-1">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Pengambilan Keputusan Bijak</strong> – Analisis statistik membantu Anda membuat keputusan finansial yang lebih baik.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/20 p-1 rounded-full mt-1">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Peringatan Dini</strong> – Identifikasi kebiasaan buruk sebelum menjadi masalah serius.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/20 p-1 rounded-full mt-1">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Kustomisasi</strong> – Sesuaikan prioritas keuangan sesuai kebutuhan pribadi Anda.
                  </span>
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/dashboard">
                  <Button variant="outline" className="gap-2 group">
                    Mulai Perjalanan Finansial Anda
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden shadow-lg max-w-md mx-auto animate-float">
              <img 
                src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80" 
                alt="Financial Planning" 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Index;
