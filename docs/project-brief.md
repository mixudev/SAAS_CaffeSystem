# Project Brief - Sistem Manajemen Cafe

Sistem Manajemen Cafe adalah aplikasi manajemen operasional cafe berbasis web terintegrasi yang memecahkan masalah inefisiensi pencatatan transaksi kasir (POS), ketidakcocokan stok bahan baku, manajemen shift karyawan yang berantakan, serta perhitungan gaji (payroll) yang memakan waktu lama. Sistem ini dirancang sebagai **modular monolith** berbasis web dengan kapabilitas offline-first pada modul kasir.

## Target User/Audience

1. **Kasir (`cashier`)**: Staf operasional harian yang membutuhkan antarmuka POS sederhana, cepat, responsif, dan ramah layar sentuh untuk transaksi penjualan.
2. **Manager Outlet (`manager`)**: Penanggung jawab operasional outlet yang mengelola stok bahan baku, mengatur shift karyawan, menyetujui cuti, dan memantau performa harian outlet.
3. **Owner (`owner`)**: Pemilik bisnis yang memiliki akses penuh ke seluruh outlet, performa keuangan gabungan, persetujuan payroll, audit log, dan pengaturan konfigurasi sistem.
4. **Staff (`staff` / non-kasir)**: Karyawan outlet (barista, kitchen, waiter) yang menggunakan sistem untuk melihat jadwal shift pribadi, melakukan absensi (clock-in/out), mengajukan cuti, dan mengunduh slip gaji pribadi.
5. **Finance (`finance` / opsional)**: Staf keuangan yang fokus mengelola penggajian (payroll) dan laporan keuangan agregat.

## Tone & Voice
- **Profesional & Bisnis**: Antarmuka dashboard bersifat bersih, efisien, berfokus pada data numerik dan grafik yang mudah dipahami.
- **Sederhana & Efisien**: Khusus untuk antarmuka kasir (POS), desain dioptimalkan untuk meminimalkan input/tap dan tidak membingungkan kasir di jam sibuk.

## Goals yang Terukur
- **Kecepatan Transaksi POS**: Dari klik tombol "bayar" hingga struk tercetak kurang dari **1.5 detik** dalam kondisi jaringan normal.
- **Responsivitas Dashboard**: Laporan dengan rentang data 1 bulan harus memuat data dalam waktu kurang dari **3 detik** menggunakan materialized views dan Redis cache.
- **Toleransi Beban (Trafik)**: Sistem mampu menangani beban puncak hingga **50 transaksi per menit per outlet** tanpa degradasi performa.
- **Ketersediaan Layanan (Uptime)**: SLA target sebesar **99.5%** uptime per bulan (di luar pemeliharaan terjadwal).

## Non-Goals (Scope Keluar/Di Luar Batasan)
- **Multi-Tenant SaaS Penuh**: Sistem pada fase awal dirancang **single-tenant** (satu pemilik usaha, multi-outlet). Isolasi data antar-tenant (pemilik usaha yang berbeda) tidak diimplementasikan di fase awal, meskipun skema database (`outlet_id` & persiapan arsitektur) harus disiapkan agar siap bermigrasi ke multi-tenant di masa depan tanpa mengubah struktur database secara masif.
- **Integrasi Payment Gateway QRIS Langsung**: Integrasi otomatis pembayaran digital (e-wallet/QRIS API dinamis) tidak dikerjakan di fase awal. Metode pembayaran digital dicatat secara manual oleh kasir setelah verifikasi fisik di EDC/QRIS statis.
- **Pelaporan Pajak Otomatis (PPh 21)**: Sistem hanya menyediakan struktur rekap data payroll dan slip gaji yang kompatibel dengan penggolongan pajak Indonesia (PPh 21), tetapi tidak menghitung atau melaporkan pajak otomatis ke portal DJP secara API.
- **Integrasi POS Hardware Khusus**: Dukungan terbatas pada printer thermal struk standar (via browser print API). Tidak mencakup integrasi timbangan digital otomatis, barcode scanner serial, atau dispenser bahan baku otomatis.

## Asumsi Krusial Proyek
- `[ASUMSI: Konektivitas Internet]` Diasumsikan setiap outlet memiliki koneksi internet utama (Wi-Fi/Seluler), namun sistem POS harus tetap dapat mencatat transaksi offline saat koneksi terputus sementara (offline-first) dan menyinkronkan data secara otomatis saat koneksi kembali.
- `[ASUMSI: PWA Platform]` Aplikasi frontend ReactJS (Vite) akan dikonfigurasi sebagai Progressive Web App (PWA) agar dapat berjalan optimal di tablet kasir dan mendukung service worker untuk cache file statis serta IndexedDB untuk data offline.
- `[ASUMSI: UI Styling]` Kami mengasumsikan UI akan dibangun menggunakan Vanilla CSS untuk ReactJS untuk mempertahankan performa maksimal, kecuali jika framework CSS tertentu disepakati di kemudian hari.
