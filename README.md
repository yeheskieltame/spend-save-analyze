
# Financial Habit Tracker

Aplikasi Financial Habit Tracker adalah solusi untuk mengelola keuangan pribadi dengan membangun kebiasaan finansial yang sehat, menganalisis pengeluaran, dan merencanakan tabungan secara efektif.

## Tech Stack

Aplikasi ini dibangun dengan teknologi modern:

- **Frontend**:
  - React - Library JavaScript untuk membangun antarmuka pengguna
  - TypeScript - Superset JavaScript dengan dukungan tipe data statis
  - Tailwind CSS - Framework CSS untuk desain responsif dan kustomisasi
  - shadcn/ui - Komponen UI yang dapat disesuaikan dan dapat diakses
  - Vite - Build tool yang cepat untuk pengembangan web modern

- **State Management & Routing**:
  - React Router - Navigasi berbasis komponen untuk aplikasi React
  - Context API - Manajemen state aplikasi
  - Tanstack Query - Fetching, caching, dan pembaruan data

- **Backend & Autentikasi**:
  - Supabase - Platform backend-as-a-service untuk autentikasi dan database
  - PostgreSQL - Database relasional untuk penyimpanan data

- **Visualisasi Data**:
  - Recharts - Library visualisasi data untuk React

## Fitur Utama

1. **Autentikasi Pengguna**
   - Login dengan email/password
   - Login dengan Google
   - Keamanan berbasis token

2. **Dashboard Keuangan**
   - Ringkasan keuangan secara visual
   - Distribusi pengeluaran dan pendapatan
   - Metrik keuangan kunci

3. **Manajemen Kebiasaan Finansial**
   - Tambah/edit/hapus kebiasaan keuangan
   - Pelacakan kebiasaan seiring waktu
   - Rekomendasi kebiasaan berdasarkan profil pengguna

4. **Analisis Keuangan**
   - Analisis tren pengeluaran
   - Perbandingan bulan ke bulan
   - Pemecahan kategori pengeluaran

5. **Tabungan dan Target**
   - Pelacakan tabungan
   - Pengaturan target finansial
   - Visualisasi kemajuan target

6. **Personalisasi**
   - Pengaturan preferensi pengguna
   - Tema aplikasi yang dapat disesuaikan

## Cara Penggunaan

### Untuk Pengguna

1. **Registrasi & Login**
   - Buat akun baru atau login dengan akun Google
   - Isi profil keuangan dasar untuk rekomendasi yang dipersonalisasi

2. **Dashboard**
   - Lihat ringkasan keuangan dan kebiasaan aktif
   - Pantau kemajuan target keuangan

3. **Tambah Kebiasaan**
   - Buat kebiasaan keuangan baru
   - Tentukan frekuensi dan kategori

4. **Analisis**
   - Jelajahi visualisasi dan analisis pengeluaran
   - Filter berdasarkan periode waktu dan kategori

5. **Tabungan**
   - Tambah catatan tabungan baru
   - Pantau pertumbuhan tabungan dengan visualisasi

### Untuk Pengembang

1. **Instalasi**
   ```sh
   # Kloning repositori
   git clone <URL_REPOSITORI>
   
   # Masuk ke direktori proyek
   cd financial-habit-tracker
   
   # Instal dependensi
   npm install
   
   # Jalankan dalam mode pengembangan
   npm run dev
   ```

2. **Struktur Proyek**
   - `/src/components` - Komponen UI yang dapat digunakan kembali
   - `/src/contexts` - Konteks React untuk manajemen state
   - `/src/pages` - Halaman utama aplikasi
   - `/src/hooks` - Custom React hooks
   - `/src/services` - Logika bisnis dan interaksi API

## Manfaat Penggunaan

- **Kesadaran Finansial** - Memahami pola pengeluaran dan pendapatan
- **Pembentukan Kebiasaan** - Membangun kebiasaan finansial yang sehat
- **Perencanaan Keuangan** - Membantu mencapai tujuan finansial jangka panjang
- **Analisis Visual** - Memvisualisasikan data keuangan untuk pemahaman yang lebih baik
- **Keamanan Data** - Perlindungan data keuangan pribadi

## Penerapan

Financial Habit Tracker dapat digunakan untuk berbagai kebutuhan:

- **Penggunaan Pribadi** - Kelola keuangan pribadi dan kebiasaan harian
- **Edukasi Keuangan** - Alat untuk mengajarkan literasi keuangan
- **Konsultasi Keuangan** - Bantu konsultan keuangan melacak kemajuan klien
- **Perencanaan Anggaran** - Bantuan visual untuk perencanaan anggaran jangka pendek dan panjang

## Dikembangkan Oleh

Yeheskiel Yunus Tame (Maret 2025)

