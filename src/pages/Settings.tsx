
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeftIcon, MoonIcon, SunIcon, UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';

const profileSchema = z.object({
  username: z.string().min(3, { message: 'Username minimal 3 karakter' }),
  full_name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter' }),
});

const Settings = () => {
  const { profile, updateProfile, updateTheme, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      full_name: '',
    },
  });
  
  // Update form values when profile data changes
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        full_name: profile.full_name || '',
      });
    }
  }, [profile, form]);
  
  const handleBackClick = () => {
    navigate('/dashboard');
  };
  
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    await updateProfile({
      username: values.username,
      full_name: values.full_name,
    });
  };
  
  const handleThemeToggle = async (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    await updateTheme(newTheme);
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
          <Button variant="ghost" onClick={handleBackClick} className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Kelola informasi akun dan preferensi aplikasi Anda.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Informasi Akun</CardTitle>
              <CardDescription>
                Update informasi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="username" className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="Nama Lengkap" className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading} 
                  >
                    {loading ? 'Loading...' : 'Simpan Perubahan'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Preferensi Aplikasi</CardTitle>
              <CardDescription>
                Sesuaikan pengalaman aplikasi Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">Tema Gelap</h3>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan mode gelap untuk aplikasi
                  </p>
                </div>
                <Switch 
                  checked={profile?.theme === 'dark'} 
                  onCheckedChange={handleThemeToggle}
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={() => signOut()} 
                disabled={loading}
              >
                Keluar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
