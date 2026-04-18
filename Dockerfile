# ── Stage 1: Build the React / Vite frontend ────────────────────────────────
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --prefer-offline

COPY frontend/ ./

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build          # outputs to /app/frontend/dist


# ── Stage 2: Backend + serve the built frontend ──────────────────────────────
FROM python:3.12-slim AS final

WORKDIR /app

# Install system dependencies required by geospatial libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
        libgdal-dev \
        libgeos-dev \
        libproj-dev \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY backend/ ./

# Copy built frontend into a static directory served by FastAPI / a simple HTTP server
COPY --from=frontend-builder /app/frontend/dist ./static

EXPOSE 7860

CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:7860", "main:app"]
