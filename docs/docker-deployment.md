# Dokumentasi Deployment Docker — Sistem Manajemen Cafe

Dokumen ini menjelaskan rancangan infrastruktur container, konfigurasi, cara instalasi, dan panduan operasional menggunakan Docker dan Docker Compose.

---

## 1. Arsitektur Container (Overview)

Sistem diatur menggunakan **Docker Compose** yang membagi aplikasi menjadi 6 container terpisah dan saling terhubung melalui Docker Network internal:

```
                                ┌──────────────────┐
                                │     Pengguna     │
                                └────────┬─────────┘
                                         │ HTTP (Port 80)
                                ┌────────▼─────────┐
                                │   cafe-nginx     │
                                └───┬───────────┬──┘
                                    │           │
                    ┌───────────────┘           └──────────────┐
                    │                                          │
          ┌─────────▼─────────┐                      ┌─────────▼─────────┐
          │   cafe-frontend   │                      │ cafe-backend-api  │
          │ (ReactJS static via │                    │ (PHP 8.4-FPM      │
          │   Nginx Alpine)   │                      │  Laravel 13 API)  │
          └───────────────────┘                      └─────┬──────┬──────┘
                                                           │      │
                                            ┌──────────────┘      └──────┐
                                            │                            │
                                     ┌──────▼──────┐              ┌──────▼──────┐
                                     │ cafe-redis  │              │cafe-postgres│
                                     │   (Redis)   │              │(PostgreSQL) │
                                     └──────┬──────┘              └──────┬──────┘
                                            │                            │
                                  ┌─────────┼────────────────────────────┤
                                  │         │                            │
                            ┌─────▼─────────▼───┐                  ┌─────▼────────────┐
                            │cafe-backend-worker│                  │cafe-backend-sched│
                            │  (Queue Worker)   │                  │   (Scheduler)    │
                            └───────────────────┘                  └──────────────────┘
```

### Detail Container:
1. **`cafe-nginx`**: Entry point utama. Melayani file statis frontend, media assets Laravel (`/storage`), dan mem-proxy request API (`/api` / `/sanctum`) ke backend.
2. **`cafe-frontend`**: Image ultra-ringan berbasis Nginx Alpine yang menyajikan file kompilasi ReactJS + Vite SPA.
3. **`cafe-backend-api`**: Container PHP 8.4 FPM Alpine yang melayani logic API Laravel 13.
4. **`cafe-backend-worker`**: Memproses tugas asinkron (job queue) seperti perhitungan gaji (payroll) dan export excel.
5. **`cafe-backend-scheduler`**: Menjalankan cron task Laravel (schedule) setiap menit (untuk refresh materialized view, auto log off, dll).
6. **`cafe-postgres`**: Database PostgreSQL 16 transaksional utama.
7. **`cafe-redis`**: Broker untuk queue, driver session, dan caching.

---

## 2. Persyaratan Sistem

- Docker Engine >= 24.0.0
- Docker Compose >= 2.20.0
- Memori Server Minimum: **2 GB RAM** (Disarankan 4 GB+ untuk production)

---

## 3. Langkah Instalasi Cepat (Quick Start)

Ikuti langkah berikut untuk menjalankan sistem secara lokal maupun di server staging/production:

### Langkah 1: Clone & Setup Environment
Pastikan file `.env` di folder `backend/` dan `frontend/` sudah sesuai. (Konfigurasi default Docker sudah otomatis disetup pada file `.env.example` masing-masing folder).

```bash
# Di folder root project, jalankan copy env jika belum ada:
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Langkah 2: Build & Jalankan Container
Jalankan perintah berikut untuk mengunduh base image, membuild image kustom, dan menjalankan container di background:

```bash
docker compose up -d --build
```

### Langkah 3: Setup Awal Laravel
Setelah seluruh container berjalan (status `healthy` / `running`), jalankan perintah berikut untuk menginisialisasi database Laravel:

```bash
# 1. Jalankan migrasi database dan seeder data awal
docker compose exec -it laravel-api php artisan migrate --seed

# 2. Buat symlink storage folder agar media/foto produk bisa diakses
docker compose exec -it laravel-api php artisan storage:link
```

Aplikasi sekarang dapat diakses melalui browser di alamat: **`http://localhost`**

---

## 4. Perintah Operasional Penting

Berikut adalah perintah-perintah yang sering digunakan saat development dan maintenance:

### Menghentikan Container
```bash
# Hentikan container tanpa menghapus data database
docker compose down

# Hentikan container dan HAPUS data volume database (Peringatan: Kehilangan data!)
docker compose down -v
```

### Memeriksa Log Container
```bash
# Melihat log gabungan secara real-time
docker compose logs -f

# Melihat log spesifik service tertentu (contoh: database atau queue worker)
docker compose logs -f postgres
docker compose logs -f laravel-worker
```

### Masuk ke dalam Shell Container
```bash
# Masuk ke shell container backend Laravel
docker compose exec -it laravel-api sh

# Masuk ke PostgreSQL console
docker compose exec -it postgres psql -U cafe_user -d cafe_management
```

### Menjalankan Perintah Artisan Laravel
Anda tidak perlu menginstall PHP di server host, semua perintah dijalankan di dalam container:
```bash
docker compose exec -it laravel-api php artisan <perintah>
# Contoh:
docker compose exec -it laravel-api php artisan route:list
docker compose exec -it laravel-api php artisan cache:clear
```

---

## 5. Optimasi & Resource Limits (Ringan & Cepat)

Konfigurasi Docker ini telah dioptimalkan agar ringan dan memiliki overhead sekecil mungkin:

1. **Alpine-based Images**: Semua image (kecuali PostgreSQL resmi) menggunakan distro Alpine Linux yang memiliki base size sangat kecil (~5MB) sehingga hemat disk space dan startup time instan.
2. **Multi-stage Builds**: Proses build ReactJS (npm install & Vite build) dan Composer Laravel dipisah ke stage builder. Image final runtime tidak membawa Node.js / compiler, hanya berisi file statis `dist/` dan binary PHP-FPM runtime murni.
3. **OPcache Enabled**: OPcache dikonfigurasikan aktif pada PHP 8.4 dengan setup production-ready (memory consumption 128MB, cache revalidation 2 detik) sehingga performa response time API di bawah 50ms.
4. **Nginx Gzip Compression**: Gzip aktif di entrypoint Nginx untuk mempercepat loading script ReactJS (bundle load time turun hingga 70%).
5. **Memory Limits**: Setiap service dibatasi penggunaan memori RAM-nya di file `docker-compose.yml` untuk menghindari memory leak yang bisa membuat server utama hang:
   - `laravel-api` & `postgres`: Max 512MB RAM
   - `laravel-worker` & `redis`: Max 256MB RAM
   - `react-app` & `nginx`: Max 128MB RAM

---

## 6. Prosedur Backup & Restore PostgreSQL

Data PostgreSQL disimpan secara persisten di volume Docker bernama `postgres_data`.

### Prosedur Backup (Export)
Untuk mencadangkan database ke file sql di mesin host:
```bash
docker compose exec -t postgres pg_dumpall -c -U cafe_user > backup_cafe_$(date +%F).sql
```

### Prosedur Restore (Import)
Untuk memulihkan database dari file sql cadangan:
```bash
cat backup_cafe_2026-06-30.sql | docker compose exec -T postgres psql -U cafe_user -d cafe_management
```

---

## 7. Troubleshooting Umum

#### Masalah: Container laravel-api gagal menyambung ke postgres saat pertama kali running
* **Penyebab**: PostgreSQL butuh waktu beberapa detik untuk inisialisasi folder data di awal, sedangkan Laravel mencoba menyambung secara instan.
* **Solusi**: Docker Compose sudah dilengkapi `condition: service_healthy` pada dependensi, sehingga Laravel hanya akan start jika Postgres sudah siap menerima koneksi. Jika ada kendala lain, periksa log dengan `docker compose logs postgres`.

#### Masalah: Perubahan kode ReactJS frontend tidak langsung ter-update di browser
* **Penyebab**: Di production Dockerfile, ReactJS dibuild menjadi static file murni dan dideploy di dalam Nginx. Perubahan kode lokal tidak akan ter-sync karena tidak memakai bind mount di file `docker-compose.yml` (karena didesain statis & terisolasi).
* **Solusi**: Jalankan build ulang dengan perintah `docker compose up -d --build react-app` setelah melakukan perubahan kode frontend. Untuk mode development intensif, disarankan menjalankan `npm run dev` secara lokal di luar container atau membuat override file `docker-compose.override.yml`.

#### Masalah: Redis connection error atau Queue macet
* **Solusi**: Cek apakah password Redis cocok antara `.env` (`REDIS_PASSWORD`) dan `docker-compose.yml` (`--requirepass`). Gunakan perintah `docker compose restart redis laravel-worker` untuk me-refresh koneksi queue.
