
# Financial Habit Tracker - Dokumentasi Teknis

## Arsitektur Aplikasi

Financial Habit Tracker adalah aplikasi web yang dibangun menggunakan teknologi modern untuk memberikan pengalaman pengguna yang optimal dan performa yang baik. Aplikasi ini menggunakan arsitektur client-side rendering dengan koneksi ke backend database untuk penyimpanan data.

### Teknologi yang Digunakan

- **Frontend**:
  - React.js: Library JavaScript untuk membangun antarmuka pengguna
  - TypeScript: Superset JavaScript yang menyediakan tipe statis
  - Vite: Build tool yang cepat untuk pengembangan modern
  - Tailwind CSS: Framework CSS untuk desain responsive
  - Shadcn UI: Komponen UI yang dapat disesuaikan
  - React Query: Library untuk manajemen state dan data fetching
  - Framer Motion: Library untuk animasi
  - React Router: Library untuk routing

- **Backend**:
  - Supabase: Platform backend-as-a-service yang menyediakan database, autentikasi, dan penyimpanan

### Struktur Folder

```
src/
├── components/        # Komponen UI yang dapat digunakan kembali
│   ├── ui/            # Komponen UI dasar (shadcn/ui)
│   └── ...            # Komponen khusus aplikasi
├── contexts/          # React contexts untuk state global
├── hooks/             # Custom React hooks
├── integrations/      # Integrasi dengan layanan eksternal (Supabase)
├── lib/               # Utilitas dan helper functions
├── pages/             # Halaman/routes aplikasi
└── ...
```

## Fitur Teknis

### Autentikasi

Autentikasi ditangani oleh Supabase Auth, yang mendukung:
- Email/password authentication
- OAuth providers (Google, GitHub, dll)
- Magic link authentication
- Session management

### Database

Aplikasi menggunakan Supabase PostgreSQL database dengan skema berikut:

- **users**: Menyimpan informasi pengguna
  - id (primary key)
  - email
  - username
  - nama
  - created_at

- **financial_habits**: Menyimpan kebiasaan finansial
  - id (primary key)
  - user_id (foreign key ke users.id)
  - judul
  - jenis (pengeluaran, pemasukan, tabungan)
  - jumlah
  - kategori
  - tanggal
  - deskripsi
  - created_at

- **savings**: Menyimpan informasi tabungan
  - id (primary key)
  - user_id (foreign key ke users.id)
  - nama
  - target_jumlah
  - jumlah_saat_ini
  - tanggal_target
  - created_at

### Optimasi Performa

Aplikasi dioptimalkan untuk performa yang baik melalui:
- **Code Splitting**: Menggunakan React.lazy dan Suspense untuk memecah kode
- **Lazy Loading**: Memuat komponen sesuai kebutuhan
- **Memoization**: Menggunakan React.memo, useMemo, dan useCallback untuk mengurangi render yang tidak perlu
- **Query Optimizations**: Konfigurasi React Query untuk caching dan pembaruan data yang optimal

### State Management

State management dalam aplikasi menggunakan kombinasi:
- React Context API untuk state global (auth, financial data)
- React Query untuk state yang terkait dengan data server
- React useState dan useReducer untuk state lokal komponen

### User Guide System

Aplikasi dilengkapi dengan sistem panduan pengguna yang:
- Menampilkan tour interaktif untuk fitur-fitur utama aplikasi
- Menyediakan dokumentasi in-app untuk help center
- Responsif untuk berbagai ukuran layar (mobile, tablet, desktop)

## Panduan Pengembangan

### Menambahkan Fitur Baru

1. Identifikasi kebutuhan fitur dan buat spesifikasi
2. Buat komponen UI yang diperlukan di `src/components/`
3. Implementasikan logika bisnis dan integrasi data
4. Tambahkan routing jika diperlukan di `App.tsx`
5. Uji fitur untuk memastikan berfungsi dengan baik

### Best Practices

- Gunakan TypeScript untuk definisi tipe yang jelas
- Pisahkan komponen UI dan logika bisnis
- Gunakan custom hooks untuk logika yang dapat digunakan kembali
- Ikuti prinsip desain yang konsisten
- Optimasi untuk performa dan aksesibilitas

## Deployment

Aplikasi dapat di-deploy menggunakan berbagai platform hosting:

1. **Netlify/Vercel**:
   - Integrasi dengan GitHub repository
   - Automatic deployment pada setiap push
   - Preview environments untuk pull requests

2. **Custom Domain**:
   - Konfigurasikan DNS untuk mengarahkan ke hosting service
   - Atur SSL/TLS untuk keamanan

## Referensi API

### Supabase Client

```typescript
import { supabase } from '@/integrations/supabase/client';

// Contoh query
const { data, error } = await supabase
  .from('financial_habits')
  .select('*')
  .eq('user_id', userId);
```

### Hooks Kustom

```typescript
// useAuth hook
const { user, signIn, signOut } = useAuth();

// useFinancial hook
const { habits, addHabit, removeHabit } = useFinancial();
```

---

*Dokumentasi ini diperuntukkan bagi pengembang dan akan diperbarui seiring perkembangan aplikasi.*
