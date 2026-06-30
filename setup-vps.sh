#!/bin/bash
# ==========================================
# SETUP SCRIPT FOR VPS PRODUCTION ENVIRONMENT
# ==========================================
set -e

echo "=== Memulai Setup Cafe Management System (VPS/Prod) ==="

# 1. Cek & Setup file .env dengan Kredensial Acak Aman
if [ ! -f .env ]; then
    echo "Membuat file .env global produksi dengan kredensial aman..."
    
    # Generate random passwords
    RAND_DB_PASS=$(openssl rand -hex 16 2>/dev/null || echo "cafe_prod_pass_$(date +%s)")
    RAND_REDIS_PASS=$(openssl rand -hex 16 2>/dev/null || echo "redis_prod_pass_$(date +%s)")
    
    cat <<EOT > .env
APP_NAME="Cafe Management System"
APP_ENV=production
APP_DEBUG=false

# Port HTTP utama
HTTP_PORT=80

# Port database & redis hanya diekspos ke localhost (aman dari luar VPS)
DB_PORT=127.0.0.1:5432
REDIS_PORT=127.0.0.1:6379

DB_DATABASE=cafe_management
DB_USER=cafe_prod_user
DB_PASSWORD=${RAND_DB_PASS}
REDIS_PASSWORD=${RAND_REDIS_PASS}

# Limits yang disesuaikan untuk VPS
API_MEM_LIMIT=1G
WORKER_MEM_LIMIT=512M
SCHEDULER_MEM_LIMIT=128M
DB_MEM_LIMIT=1G
REDIS_MEM_LIMIT=512M
FRONTEND_MEM_LIMIT=256M
EOT
fi

# Buat env backend & frontend jika belum ada
if [ ! -f backend/.env ]; then
    echo "Membuat file .env backend..."
    cp backend/.env.example backend/.env
    
    # Sinkronisasi environment di backend/.env
    sed -i "s/APP_ENV=local/APP_ENV=production/" backend/.env
    sed -i "s/APP_DEBUG=true/APP_DEBUG=false/" backend/.env
    sed -i "s/DB_USERNAME=cafe_user/DB_USERNAME=cafe_prod_user/" backend/.env
    
    # Update password di backend/.env
    DB_PASS_VAL=$(grep DB_PASSWORD .env | cut -d '=' -f2)
    REDIS_PASS_VAL=$(grep REDIS_PASSWORD .env | cut -d '=' -f2)
    
    sed -i "s/DB_PASSWORD=cafe_secure_password_123/DB_PASSWORD=${DB_PASS_VAL}/" backend/.env
    sed -i "s/REDIS_PASSWORD=redis_secure_password_123/REDIS_PASSWORD=${REDIS_PASS_VAL}/" backend/.env
fi

if [ ! -f frontend/.env ]; then
    echo "Membuat file .env frontend..."
    cp frontend/.env.example frontend/.env
fi

# 2. Build & Run Container
echo "Membangun dan menjalankan container Docker..."
docker compose -f docker-compose.yml up -d --build

# 3. Menunggu PostgreSQL database siap
echo "Menunggu database PostgreSQL siap..."
DB_USER_VAL=$(grep DB_USER .env | cut -d '=' -f2)
DB_NAME_VAL=$(grep DB_DATABASE .env | cut -d '=' -f2)

retries=30
until docker compose exec postgres pg_isready -U "${DB_USER_VAL:-cafe_prod_user}" -d "${DB_NAME_VAL:-cafe_management}" >/dev/null 2>&1 || [ $retries -eq 0 ]; do
    echo "Database belum siap, menunggu 1 detik..."
    sleep 1
    retries=$((retries-1))
done

# 4. Inisialisasi & Optimasi Laravel
echo "Menjalankan konfigurasi awal & caching Laravel..."

# Generate APP_KEY if empty
APP_KEY_VAL=$(grep APP_KEY backend/.env | cut -d '=' -f2)
if [ -z "$APP_KEY_VAL" ]; then
    docker compose exec laravel-api php artisan key:generate --force
fi

echo "Menjalankan migrasi database..."
docker compose exec laravel-api php artisan migrate --force

echo "Membuat storage link..."
docker compose exec laravel-api php artisan storage:link || true

echo "Menjalankan optimasi cache Laravel (config, routes, views)..."
docker compose exec laravel-api php artisan optimize

echo "=== SETUP VPS PROD SELESAI ==="
echo "Sistem Cafe Management aktif di port 80!"
EOT
