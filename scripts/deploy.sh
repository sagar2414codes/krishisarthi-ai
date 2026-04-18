#!/usr/bin/env bash
# scripts/deploy.sh — Manual deployment helper.
#
# Requires:
#   - Docker + docker buildx
#   - DOCKER_USERNAME / DOCKER_PASSWORD env vars (or already logged-in)
#   - vercel CLI (npm i -g vercel) for frontend deploy
#   - railway CLI (npm i -g @railway/cli) for backend deploy
#
# Usage:
#   ./scripts/deploy.sh [backend|frontend|all]   (default: all)
#
set -euo pipefail

TARGET="${1:-all}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ── helpers ──────────────────────────────────────────────────────────────────
info()    { echo "ℹ️  $*"; }
success() { echo "✅  $*"; }
error()   { echo "❌  $*" >&2; exit 1; }

require_cmd() {
  command -v "$1" &>/dev/null || error "'$1' is required but not found. $2"
}

# ── backend deploy ────────────────────────────────────────────────────────────
deploy_backend() {
  info "Deploying backend to Railway…"
  require_cmd railway "Install with: npm i -g @railway/cli"
  [[ -n "${RAILWAY_TOKEN:-}" ]] || error "RAILWAY_TOKEN env var is not set."

  (cd "$ROOT_DIR" && railway up --service backend --detach)
  success "Backend deployed to Railway."
}

# ── frontend deploy ───────────────────────────────────────────────────────────
deploy_frontend() {
  info "Deploying frontend to Vercel…"
  require_cmd vercel "Install with: npm i -g vercel"
  [[ -n "${VERCEL_TOKEN:-}" ]] || error "VERCEL_TOKEN env var is not set."

  (cd "$ROOT_DIR/frontend" && vercel --prod --token="$VERCEL_TOKEN")
  success "Frontend deployed to Vercel."
}

# ── docker build & push ───────────────────────────────────────────────────────
docker_push() {
  info "Building and pushing Docker images…"
  require_cmd docker "Install Docker from https://docs.docker.com/get-docker/"
  [[ -n "${DOCKER_USERNAME:-}" ]] || error "DOCKER_USERNAME env var is not set."
  [[ -n "${DOCKER_PASSWORD:-}" ]] || error "DOCKER_PASSWORD env var is not set."

  echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

  docker buildx build \
    -t "${DOCKER_USERNAME}/krishisarthi-backend:latest" \
    --push \
    "$ROOT_DIR/backend"

  docker buildx build \
    --build-arg "VITE_API_BASE_URL=${VITE_API_BASE_URL:-}" \
    -t "${DOCKER_USERNAME}/krishisarthi-frontend:latest" \
    --push \
    "$ROOT_DIR/frontend"

  success "Docker images pushed."
}

# ── entry point ───────────────────────────────────────────────────────────────
case "$TARGET" in
  backend)  deploy_backend ;;
  frontend) deploy_frontend ;;
  docker)   docker_push ;;
  all)
    deploy_backend
    deploy_frontend
    ;;
  *)
    echo "Usage: $0 [backend|frontend|docker|all]"
    exit 1
    ;;
esac
