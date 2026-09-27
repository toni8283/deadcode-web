#!/usr/bin/env bash
set -e
# Install backend dependencies
echo "Installing backend dependencies..."
python3 -m venv venv
source venv/bin/activate
# Install backend dependencies
pip install -r backend/requirements.txt
# Install deadcode from local repository (editable)
pip install -e /home/mrblair/Documents/deadcode
