#!/bin/bash

set -e

COMPOSE_FILES="-f docker-compose.yml -f docker-compose.dev.yml"

echo ""
echo "========================================="
echo "      CAFFE Development Stop"
echo "========================================="
echo ""

echo "[1/2] Stopping all services..."

docker compose $COMPOSE_FILES --profile dev down --remove-orphans

echo "[2/2] Done."

echo ""
echo "========================================="
echo "    All Development Services Stopped"
echo "========================================="
echo ""
