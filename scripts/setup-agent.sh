#!/bin/bash

# Navigate to the agent directory
cd "$(dirname "$0")/../agent" || exit 1

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
  echo "Creating Python virtual environment..."
  if command -v python3 >/dev/null 2>&1; then
    python3 -m venv .venv
  else
    python -m venv .venv
  fi
  if [ $? -ne 0 ]; then
    echo "Failed to create virtual environment"
    exit 1
  fi
  echo "Virtual environment created successfully"
fi

# Activate the virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Verify we're in the virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
  echo "Failed to activate virtual environment"
  exit 1
fi

echo "Installing Python dependencies in virtual environment..."

# Install requirements using the virtual environment's pip directly
if [ -f "requirements.txt" ]; then
  .venv/bin/pip install -r requirements.txt
  if [ $? -ne 0 ]; then
    echo "Failed to install Python dependencies"
    exit 1
  fi
  echo "Python dependencies installed successfully"
else
  echo "requirements.txt not found"
  exit 1
fi
