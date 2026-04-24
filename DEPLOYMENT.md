# KrishiSarthi AI – Deployment Guide

Complete guide for deploying the KrishiSarthi AI application (React + TypeScript frontend, FastAPI Python backend with ML models).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Render Deployment (Recommended)](#render-deployment-recommended)
4. [Vercel Deployment (Frontend Only)](#vercel-deployment-frontend-only)
5. [Railway Deployment](#railway-deployment)
6. [Docker Local Testing](#docker-local-testing)
7. [CI/CD with GitHub Actions](#cicd-with-github-actions)
8. [Monitoring & Logs](#monitoring--logs)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- GitHub account with access to `sagar2414codes/krishisarthi-ai`
- Docker Desktop (for local testing)
- Node.js 18+ (for local frontend builds)
- Python 3.11+ (for local backend runs)

---

## Environment Variables

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` and set:

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API URL | `https://krishisarthi-backend.onrender.com` |

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and set:

| Variable | Description | Example |
|---|---|---|
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key | `abc123...` |
| `PYTHON_ENV` | Runtime environment | `production` |
| `LOG_LEVEL` | Logging verbosity | `INFO` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://krishisarthi.vercel.app` |

Get a free OpenWeatherMap key at https://openweathermap.org/api.

---

## Render Deployment (Recommended)

Render hosts both the frontend and backend using the included `render.yaml`.

### Steps

1. Sign in at https://render.com with your GitHub account.
2. Click **New → Blueprint** and select the `sagar2414codes/krishisarthi-ai` repository.
3. Render detects `render.yaml` automatically and shows two services:
   - `krishisarthi-backend` – FastAPI server
   - `krishisarthi-frontend` – React/Nginx container
4. Click **Apply** to create both services.
5. Set the `OPENWEATHER_API_KEY` secret in the backend service's **Environment** tab.
6. Both services will build and deploy. URLs will be:
   - Backend: `https://krishisarthi-backend.onrender.com`
   - Frontend: `https://krishisarthi-frontend.onrender.com`

### Notes

- Free tier services spin down after 15 minutes of inactivity. Upgrade to the Starter plan (~$7/mo) for always-on hosting.
- The first deploy takes ~10 minutes because geospatial libraries (GDAL, Proj) must be compiled.

---

## Vercel Deployment (Frontend Only)

Best for fast global CDN delivery of the React frontend. The backend still needs a separate host (e.g., Render or Railway).

### Steps

1. Sign in at https://vercel.com with GitHub.
2. Click **Add New → Project** and import `sagar2414codes/krishisarthi-ai`.
3. Set **Root Directory** to `frontend`.
4. Add environment variable:
   - `VITE_API_BASE_URL` → your backend URL (e.g., `https://krishisarthi-backend.onrender.com`)
5. Click **Deploy**. Your app will be live at `https://krishisarthi-ai.vercel.app` within ~2 minutes.

### Notes

- `vercel.json` at the repo root proxies `/api/*` requests to the backend URL automatically.
- Update the proxy destination in `vercel.json` if your backend URL differs from the default.

---

## Railway Deployment

Railway can run the Python backend as a Docker container.

### Steps

1. Sign in at https://railway.app with GitHub.
2. Click **New Project → Deploy from GitHub repo**.
3. Select `sagar2414codes/krishisarthi-ai`.
4. Railway detects `railway.json` and builds the backend Dockerfile.
5. Add environment variables in the **Variables** tab:
   - `OPENWEATHER_API_KEY`
6. Railway assigns a public URL automatically (e.g., `https://krishisarthi-ai.up.railway.app`).

### Notes

- Railway's free tier provides $5/month of compute credits.
- The `PORT` variable is injected automatically by Railway; the start command in `railway.json` uses it.

---

## Docker Local Testing

Run both services locally using Docker Compose.

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/sagar2414codes/krishisarthi-ai.git
cd krishisarthi-ai

# 2. Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Edit backend/.env and add your OPENWEATHER_API_KEY

# 4. Build and start both containers
docker compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:7860
# API docs → http://localhost:7860/docs
```

### Stopping

```bash
docker compose down
```

### Rebuilding after code changes

```bash
docker compose up --build --force-recreate
```

---

## CI/CD with GitHub Actions

The `.github/workflows/deploy.yml` workflow runs automatically on every push to `main` and on pull requests.

### What it does

| Job | Trigger | Action |
|---|---|---|
| `frontend` | push / PR | Install deps, lint, build React app |
| `backend` | push / PR | Python syntax check |
| `docker-backend` | push to `main` | Build backend Docker image (validates Dockerfile) |
| `docker-frontend` | push to `main` | Build frontend Docker image (validates Dockerfile) |

### Required GitHub Secrets (optional)

Set these in **Settings → Secrets → Actions** if you want to push images to Docker Hub:

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `VITE_API_BASE_URL` | Production backend URL (used in frontend build) |

If `DOCKERHUB_USERNAME` is not set, the workflow still validates the Docker build without pushing.

---

## Monitoring & Logs

### Render

- **Logs**: Service dashboard → **Logs** tab (real-time streaming).
- **Metrics**: Service dashboard → **Metrics** tab (CPU, memory, requests).
- **Health checks**: Configured at `/health`; Render restarts the service automatically on failure.

### Railway

- **Logs**: Project → Deployment → **View Logs**.
- **Metrics**: Project → **Metrics** tab.

### Docker (local)

```bash
# Stream logs from all containers
docker compose logs -f

# Stream logs from one service
docker compose logs -f backend
docker compose logs -f frontend
```

### Backend health endpoint

```
GET /health
→ 200 OK  {"status": "ok"}
```

---

## Troubleshooting

### Backend fails to start – missing models

```
FileNotFoundError: models/crop_model.tflite not found
```

**Fix**: Ensure model files are committed to `backend/models/`. The `.gitignore` may be excluding them. Check with `git status backend/models/`.

### GDAL / Proj install errors during Docker build

**Fix**: The backend `Dockerfile` uses `python:3.11-slim` + `apt-get install gdal-bin libgdal-dev`. If you see version conflicts, pin the apt package version or use a pre-built geospatial base image like `ghcr.io/osgeo/gdal:ubuntu-small-latest`.

### Frontend shows "Network Error" / cannot reach API

1. Check `VITE_API_BASE_URL` is set correctly.
2. Verify backend is running: `curl https://your-backend-url/health`.
3. Check browser DevTools → Network tab for the actual request URL.

### Render free tier – cold starts

Free services sleep after 15 minutes. The first request after sleep takes ~30 s. Upgrade to Starter or use a cron job to ping `/health` every 10 minutes.

### Port conflicts locally

Change port mappings in `docker-compose.yml`:

```yaml
ports:
  - "8080:7860"  # host:container
```

---

*Built with ❤️ for Indian Farmers 🇮🇳*
