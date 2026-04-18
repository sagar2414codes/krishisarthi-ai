#!/usr/bin/env bash
# scripts/test-local.sh — Spin up the full stack locally with Docker Compose.
#
# Usage:
#   ./scripts/test-local.sh          # build fresh images and start
#   ./scripts/test-local.sh --no-build  # reuse existing images
#
set -euo pipefail

COMPOSE_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/docker-compose.yml"
BUILD_FLAG="--build"

if [[ "${1:-}" == "--no-build" ]]; then
  BUILD_FLAG=""
fi

echo "🌾  KrishiSarthi AI — Local Stack"
echo "──────────────────────────────────"

# Create a local .env from .env.example if one doesn't already exist
ROOT_DIR="$(dirname "$COMPOSE_FILE")"
if [[ ! -f "$ROOT_DIR/.env" ]]; then
  echo "📋  No .env found — copying from .env.example"
  cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
fi

echo "🐳  Starting services with Docker Compose…"
docker compose -f "$COMPOSE_FILE" up $BUILD_FLAG --remove-orphans

# Ctrl-C will fall through to here
echo "✅  Services stopped."
