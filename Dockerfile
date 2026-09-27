# Multi-stage Dockerfile for DeadCode Web Application
# Stage 1: Build React Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime Environment with Python 3.12, Git, and DeadCode CLI
FROM python:3.12-slim

# Install system dependencies (Git is required by DeadCode for worktrees & clone)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Configure global Git identity for DeadCode proof worktrees
RUN git config --global user.name "DeadCode Demo" && \
    git config --global user.email "demo@deadcode.dev"

WORKDIR /app

# Install DeadCode CLI directly from GitHub repository
RUN pip install --no-cache-dir git+https://github.com/toni8283/deadcode.git

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend code, demo template, and built frontend
COPY backend/ ./backend/
COPY demo_template/ ./demo_template/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (Render sets $PORT environment variable, default 8000)
ENV PORT=8000
EXPOSE 8000

# Start FastAPI server via uvicorn
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
