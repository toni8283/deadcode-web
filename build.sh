#!/usr/bin/env bash
set -e

echo "=== Building React Frontend ==="
cd frontend
npm ci
npm run build
cd ..

echo "=== Installing Python Dependencies & DeadCode CLI ==="
pip install -r backend/requirements.txt

echo "=== Configuring Git Identity ==="
git config --global user.name "DeadCode Demo" || true
git config --global user.email "demo@deadcode.dev" || true

echo "=== Build Complete ==="
