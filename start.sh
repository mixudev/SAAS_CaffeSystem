#!/bin/bash
set -e

# ==========================================
# CAFFE — Local Development Starter
# Hybrid: Docker untuk infra + backend,
#         Vite HMR container untuk frontend
# ==========================================

echo ""
echo "======================================"
echo "  CAFFE — Local Dev Start"
echo "======================================"
echo ""

# ── 1. Setup .env ──────────────────────────
if [ ! -f .env ]; then
    echo "[1/7] Membuat .env global..."
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
    echo "[1/7] Membuat backend/.env..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    echo "[1/7] Membuat frontend/.env..."
    cp frontend/.env.example frontend/.env
fi

# ── 2. Generate APP_KEY ────────────────────
APP_KEY_VAL=$(grep APP_KEY backend/.env | cut -d '=' -f2)
if [ -z "$APP_KEY_VAL" ]; then
    echo "[2/7] Generate APP_KEY Laravel..."
    docker compose run --rm laravel-api php artisan key:generate
fi

# ── 3. Start infrastructure & backend ──────
echo "[3/7] Start PostgreSQL, Redis, Laravel..."
docker compose up -d postgres redis laravel-api laravel-worker laravel-scheduler

# ── 4. Wait for PostgreSQL ─────────────────
echo "[4/7] Menunggu PostgreSQL siap..."
DB_USER_VAL=${DB_USER:-cafe_user}
DB_NAME_VAL=${DB_DATABASE:-cafe_management}
retries=30
until docker compose exec postgres pg_isready -U "${DB_USER_VAL}" -d "${DB_NAME_VAL}" >/dev/null 2>&1 || [ $retries -eq 0 ]; do
    echo "  -> Menunggu... (sisa $retries)"
    sleep 2
    retries=$((retries - 1))
done
if [ $retries -eq 0 ]; then
    echo "ERROR: PostgreSQL tidak siap. Cek log: docker compose logs postgres"
    exit 1
fi
echo "  -> PostgreSQL siap!"

# ── 5. Migrate database ────────────────────
echo "[5/7] Menjalankan migrasi & seeder..."
docker compose exec laravel-api php artisan migrate --seed
docker compose exec laravel-api php artisan storage:link || true

# ── 6. Stop static frontend ────────────────
echo "[6/7] Mengganti frontend ke Vite HMR..."
docker compose stop react-app 2>/dev/null || true

# ── 7. Start Vite dev container ────────────
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d react-app-dev

# Tunggu Vite benar-benar siap
echo "  -> Menunggu Vite dev server siap..."
for i in $(seq 1 30); do
    if docker exec cafe-frontend-dev sh -c "ps aux | grep -v grep | grep -q 'vite'" 2>/dev/null; then
        echo "  -> Vite siap!"
        break
    fi
    sleep 2
done

# ── 8. Start nginx with dev config ─────────
echo "[8/8] Start nginx dengan config dev..."
NETWORK_NAME=$(docker network ls --filter name=cafe --format "{{.Name}}" | head -1)
if [ -z "$NETWORK_NAME" ]; then
    echo "ERROR: Network cafe tidak ditemukan. Jalankan: docker compose up -d"
    exit 1
fi

docker rm -f cafe-nginx 2>/dev/null || true

docker run -d \
    --name cafe-nginx \
    --network "$NETWORK_NAME" \
    -p 80:80 \
    -v "$(pwd)/nginx/conf.d/dev-default.conf:/etc/nginx/conf.d/default.conf:ro" \
    -v "$(pwd)/backend/storage/app/public:/var/www/backend/storage/app/public:ro" \
    --restart unless-stopped \
    nginx:1.27-alpine

# ── Done ────────────────────────────────────
echo ""
echo "======================================"
echo "  CAFFE — Siap!"
echo "======================================"
echo ""
echo "  Frontend : http://localhost"
echo "  API      : http://localhost/api/v1"
echo "  Vite HMR : http://localhost:5173 (akses langsung)"
echo ""
echo "  Log Vite : docker compose logs -f react-app-dev"
echo "  Log API  : docker compose logs -f laravel-api"
echo ""
echo "  Setelah install npm package baru, restart Vite:"
echo "    docker compose restart react-app-dev"
echo "  Kembali ke mode production:"
echo "    docker compose up -d react-app && docker rm -f cafe-nginx && docker compose up -d nginx"
echo ""
