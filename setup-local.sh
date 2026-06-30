#!/bin/bash
# ==========================================
# SETUP SCRIPT FOR LOCAL DEVELOPMENT
# ==========================================
set -e

echo "=== Memulai Setup Cafe Management System (Local Dev) ==="

# 1. Cek & Setup file .env
if [ ! -f .env ]; then
    echo "Membuat file .env global dari default..."
    cat <<EOT > .env
APP_NAME="Cafe Management System"
APP_ENV=local
APP_DEBUG=true

HTTP_PORT=80
DB_PORT=5432
REDIS_PORT=6379

DB_DATABASE=cafe_management
DB_USER=cafe_user
DB_PASSWORD=cafe_secure_password_123
REDIS_PASSWORD=redis_secure_password_123

API_MEM_LIMIT=512M
WORKER_MEM_LIMIT=256M
SCHEDULER_MEM_LIMIT=128M
DB_MEM_LIMIT=512M
REDIS_MEM_LIMIT=256M
FRONTEND_MEM_LIMIT=128M
EOT
fi

if [ ! -f backend/.env ]; then
    echo "Membuat file .env backend..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    echo "Membuat file .env frontend..."
    cp frontend/.env.example frontend/.env
fi

# 2. Hentikan container lama (jika ada)
echo "Menghentikan container lama jika ada..."
docker compose down --remove-orphans

# 3. Build & Run Container
echo "Membangun dan menjalankan container Docker..."
docker compose up -d --build

# 4. Menunggu PostgreSQL database siap
echo "Menunggu database PostgreSQL siap menerima koneksi..."
# Read credentials from root .env
DB_USER_VAL=$(grep DB_USER .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
DB_NAME_VAL=$(grep DB_DATABASE .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")

# Loop waiting for PostgreSQL
retries=30
until docker compose exec postgres pg_isready -U "${DB_USER_VAL:-cafe_user}" -d "${DB_NAME_VAL:-cafe_management}" >/dev/null 2>&1 || [ $retries -eq 0 ]; do
    echo "Database belum siap, menunggu 1 detik... (sisa percobaan: $retries)"
    sleep 1
    retries=$((retries-1))
done

if [ $retries -eq 0 ]; then
    echo "ERROR: PostgreSQL gagal siap dalam waktu 30 detik. Silakan periksa log dengan 'docker compose logs postgres'."
    exit 1
fi

echo "Database PostgreSQL siap!"

# 5. Setup Laravel
echo "Menjalankan konfigurasi awal Laravel..."

# Generate APP_KEY if empty
APP_KEY_VAL=$(grep APP_KEY backend/.env | cut -d '=' -f2)
if [ -z "$APP_KEY_VAL" ]; then
    echo "Menghasilkan Application Key Laravel..."
    docker compose exec laravel-api php artisan key:generate
fi

echo "Menjalankan migrasi database dan seeder data awal..."
docker compose exec laravel-api php artisan migrate:fresh --seed

echo "Membuat storage link link..."
docker compose exec laravel-api php artisan storage:link || true

echo "=== SETUP SELESAI ==="
echo "Sistem Cafe Management siap digunakan!"
echo "Frontend URL : http://localhost"
echo "Backend API  : http://localhost/api/v1"
echo "Dokumentasi  : http://localhost/api/documentation (Jika diaktifkan)"
EOT
