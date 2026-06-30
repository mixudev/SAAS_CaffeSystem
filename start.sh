#!/bin/bash

set -e

#############################################
# CAFFE Development Starter
#############################################

SEED=false
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.dev.yml"

for arg in "$@"; do
    case $arg in
        --seed)
            SEED=true
            shift
            ;;
    esac
done

echo ""
echo "========================================="
echo "      CAFFE Development Environment"
echo "========================================="
echo ""

#############################################
# 1. Create .env files
#############################################

echo "[1/8] Checking environment..."

if [ ! -f .env ]; then
cat > .env <<EOF
APP_NAME="Cafe Management System"
APP_ENV=local
APP_DEBUG=true

HTTP_PORT=80

DB_PORT=5432
DB_DATABASE=cafe_management
DB_USER=cafe_user
DB_PASSWORD=cafe_secure_password_123

REDIS_PORT=6379
REDIS_PASSWORD=redis_secure_password_123
EOF
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
fi

#############################################
# 2. Start Docker (with dev profile)
#############################################

echo "[2/8] Starting Docker (dev profile)..."

# Swap nginx config: use dev-default.conf (proxies to Vite HMR server)
if [ -f nginx/conf.d/default.conf ] && [ -f nginx/conf.d/dev-default.conf ]; then
    cp nginx/conf.d/default.conf nginx/conf.d/default.conf.prod.bak
    cp nginx/conf.d/dev-default.conf nginx/conf.d/default.conf
fi

docker compose $COMPOSE_FILES --profile dev up -d

#############################################
# 3. Wait PostgreSQL
#############################################

echo "[3/8] Waiting PostgreSQL..."

until docker compose $COMPOSE_FILES exec -T postgres pg_isready -U cafe_user -d cafe_management >/dev/null 2>&1
do
    printf "."
    sleep 2
done

echo ""
echo "PostgreSQL Ready."

#############################################
# 4. Composer Install (via dedicated service)
#############################################

echo "[4/8] Composer install..."

docker compose $COMPOSE_FILES run --rm composer

#############################################
# 5. Generate APP_KEY
#############################################

echo "[5/8] Checking APP_KEY..."

APP_KEY=$(grep "^APP_KEY=" backend/.env | cut -d '=' -f2)

if [[ -z "$APP_KEY" ]]; then
    docker compose $COMPOSE_FILES exec -T laravel-api php artisan key:generate
fi

#############################################
# 6. Migration
#############################################

echo "[6/8] Running migration..."

docker compose $COMPOSE_FILES exec -T laravel-api php artisan migrate --force

#############################################
# 7. Storage Link
#############################################

echo "[7/8] Checking Storage Link..."

if [ ! -L backend/public/storage ]; then
    docker compose $COMPOSE_FILES exec -T laravel-api php artisan storage:link
fi

#############################################
# Optional Seeder
#############################################

if [ "$SEED" = true ]; then
    echo "Running Seeder..."
    docker compose $COMPOSE_FILES exec -T laravel-api php artisan db:seed --force
fi

#############################################
# 8. Done
#############################################

echo "[8/8] Done."

echo ""
echo "========================================="
echo "         Development Ready!"
echo "========================================="
echo ""
echo "Frontend (production) : http://localhost"
echo "Frontend (dev — HMR)  : http://localhost:5173"
echo "API                   : http://localhost/api"
echo ""
echo "Useful Commands"
echo "---------------"
echo "Logs API      : docker compose logs -f laravel-api"
echo "Logs Frontend : docker compose logs -f react-app-dev"
echo "Stop          : ./stop.sh"
echo ""
