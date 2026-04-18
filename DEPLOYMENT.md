# 🚀 KrishiSarthi AI — Deployment Guide

This guide covers every deployment option for the project, from quick local testing with Docker Compose through to fully automated production deployments on Vercel (frontend) and Railway (backend).

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Environment Variables](#environment-variables)
3. [Local Development with Docker](#local-development-with-docker)
4. [Frontend — Deploy to Vercel](#frontend--deploy-to-vercel)
5. [Backend — Deploy to Railway](#backend--deploy-to-railway)
6. [Docker Hub — Build & Push Images](#docker-hub--build--push-images)
7. [CI/CD — GitHub Actions](#cicd--github-actions)
8. [Production CORS Configuration](#production-cors-configuration)
9. [Monitoring & Logging](#monitoring--logging)

---

## Architecture Overview

```
┌─────────────────────┐      HTTPS       ┌──────────────────────────┐
│  Browser / Mobile   │ ──────────────── │  Vercel CDN (Frontend)   │
│                     │                  │  React + Vite SPA        │
└─────────────────────┘                  └──────────────┬───────────┘
                                                        │  REST API calls
                                         ┌──────────────▼───────────┐
                                         │  Railway (Backend)        │
                                         │  Python FastAPI           │
                                         │  Port 7860 / $PORT        │
                                         └──────────────────────────┘
```

Both services are **independently deployable** and communicate via HTTP REST.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Where Used | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Frontend (build-time) | Full URL of the deployed backend, e.g. `https://krishisarthi-backend.up.railway.app` |
| `ALLOWED_ORIGINS` | Backend (runtime) | Comma-separated list of allowed CORS origins, e.g. `https://krishisarthi.vercel.app` |
| `PORT` | Backend (runtime) | Port the server listens on. Railway sets this automatically. |
| `DOCKER_USERNAME` | CI secret | Docker Hub username |
| `DOCKER_PASSWORD` | CI secret | Docker Hub access token |
| `VERCEL_TOKEN` | CI secret | Vercel API token |
| `VERCEL_ORG_ID` | CI secret | Vercel organisation ID |
| `VERCEL_PROJECT_ID` | CI secret | Vercel project ID |
| `RAILWAY_TOKEN` | CI secret | Railway API token |

---

## Local Development with Docker

> **Prerequisites:** Docker Desktop (or Docker Engine + Compose plugin)

### 1. Clone and configure

```bash
git clone https://github.com/sagar2414codes/krishisarthi-ai.git
cd krishisarthi-ai
cp .env.example .env        # edit if needed
```

### 2. Start the stack

```bash
# Build images and start both services
./scripts/test-local.sh

# — or without rebuilding images —
./scripts/test-local.sh --no-build
```

| Service | URL |
|---|---|
| Frontend | <http://localhost:3000> |
| Backend API | <http://localhost:7860> |
| Backend Docs | <http://localhost:7860/docs> |

### 3. Stop the stack

Press **Ctrl-C** in the terminal running the script, or run:

```bash
docker compose down
```

---

## Frontend — Deploy to Vercel

### Option A — Vercel Dashboard (zero-config)

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend`.
5. Vercel auto-detects Vite — keep the defaults.
6. Add the environment variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** your Railway backend URL, e.g. `https://krishisarthi-backend.up.railway.app`
7. Click **Deploy**.

The `vercel.json` at the repo root pre-configures the SPA rewrite rules and cache headers.

### Option B — Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Follow the interactive prompts. Set `VITE_API_BASE_URL` when asked for environment variables.

---

## Backend — Deploy to Railway

### Option A — Railway Dashboard (zero-config)

1. Go to [railway.app](https://railway.app) and click **New Project → Deploy from GitHub repo**.
2. Select your repository.
3. Railway detects `railway.json` and uses `backend/Dockerfile` automatically.
4. Add environment variables in the Railway dashboard:
   - `ALLOWED_ORIGINS` → your Vercel frontend URL, e.g. `https://krishisarthi.vercel.app`
5. Railway assigns a public URL; copy it and set `VITE_API_BASE_URL` in Vercel.

### Option B — Railway CLI

```bash
npm install -g @railway/cli
railway login
railway link          # link to an existing project, or create a new one
railway up --service backend
```

---

## Docker Hub — Build & Push Images

```bash
# Set credentials
export DOCKER_USERNAME=your-dockerhub-username
export DOCKER_PASSWORD=your-dockerhub-token
export VITE_API_BASE_URL=https://krishisarthi-backend.up.railway.app

# Build and push all images
./scripts/deploy.sh docker
```

Images are tagged as:

- `<username>/krishisarthi-backend:latest`
- `<username>/krishisarthi-frontend:latest`

---

## CI/CD — GitHub Actions

Two workflows are included:

### `ci.yml` — Runs on every Pull Request

| Job | What it does |
|---|---|
| `frontend-lint` | ESLint, TypeScript type-check, and production build |
| `backend-lint` | flake8 Python linting |

### `deploy.yml` — Runs on push to `main`

| Job | What it does |
|---|---|
| `docker-build-push` | Builds and pushes Docker images to Docker Hub |
| `deploy-vercel` | Deploys frontend to Vercel |
| `deploy-railway` | Deploys backend to Railway |

Each job is **gated** by the presence of the corresponding secret — if a secret is not set the job is skipped gracefully.

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** in your repository and add:

| Secret | Required for |
|---|---|
| `DOCKER_USERNAME` | Docker Hub push |
| `DOCKER_PASSWORD` | Docker Hub push |
| `VITE_API_BASE_URL` | Frontend Docker image build |
| `VERCEL_TOKEN` | Vercel deployment |
| `VERCEL_ORG_ID` | Vercel deployment |
| `VERCEL_PROJECT_ID` | Vercel deployment |
| `RAILWAY_TOKEN` | Railway deployment |

#### How to obtain each secret

**Docker Hub**
```
Docker Hub → Account Settings → Security → New Access Token
```

**Vercel**
```
Vercel Dashboard → Settings → Tokens → Create Token
```

To find `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:
```bash
cd frontend
vercel link          # creates .vercel/project.json
cat .vercel/project.json
```

**Railway**
```
Railway Dashboard → Account → Tokens → New Token
```

---

## Production CORS Configuration

By default the backend allows all origins (`*`), which is fine for development.

For production, set `ALLOWED_ORIGINS` to a comma-separated list of the exact origins that should be permitted:

```
# Railway environment variable
ALLOWED_ORIGINS=https://krishisarthi.vercel.app,https://www.krishisarthi.com
```

The FastAPI application reads this variable at startup and passes it to the `CORSMiddleware`.

---

## Monitoring & Logging

### Backend

FastAPI generates structured logs via Python's `logging` module. On Railway, logs are available in the **Deployments → Logs** tab.

To increase log verbosity, set the `LOG_LEVEL` environment variable:

```
LOG_LEVEL=DEBUG
```

The FastAPI auto-generated docs (Swagger UI) are available at `/docs` and can be used as a health probe.

### Frontend

Vercel provides **Analytics** (page views, Core Web Vitals) and **Function Logs** (for Edge/Serverless functions) out of the box. Enable them from the project dashboard.

### Docker / Self-hosted

When running via Docker Compose, view logs with:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

To persist logs, mount a volume or configure a logging driver in `docker-compose.yml`.
