#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        print_warning "Killing processes on port $port..."
        echo $pids | xargs kill -9 2>/dev/null
        sleep 2
    fi
}

# Function to cleanup on exit
cleanup() {
    print_status "Cleaning up..."
    kill_port 3000
    kill_port 8123
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

print_status "Starting development environment setup..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if pnpm is installed
if ! command_exists pnpm; then
    print_error "pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Check if Python is installed
if ! command_exists python3 && ! command_exists python; then
    print_error "Python is not installed. Please install Python 3.7+ first."
    exit 1
fi

# Kill any existing processes on our ports
print_status "Clearing ports 3000 and 8123..."
kill_port 3000
kill_port 8123

# Install frontend dependencies
print_status "Installing frontend dependencies with pnpm..."
if ! pnpm install; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi
print_success "Frontend dependencies installed"

# Setup Python virtual environment for agent
print_status "Setting up Python virtual environment for agent..."
cd agent || exit 1

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    print_status "Creating Python virtual environment..."
    if command_exists python3; then
        python3 -m venv .venv
    else
        python -m venv .venv
    fi
    if [ $? -ne 0 ]; then
        print_error "Failed to create virtual environment"
        exit 1
    fi
    print_success "Virtual environment created"
else
    print_status "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source .venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
if command_exists pip3; then
    pip3 install -r requirements.txt
else
    pip install -r requirements.txt
fi

if [ $? -ne 0 ]; then
    print_error "Failed to install Python dependencies"
    exit 1
fi
print_success "Python dependencies installed"

# Go back to project root
cd ..

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. You may need to create one with your API keys."
fi

# Start both services
print_status "Starting development servers..."
print_status "Frontend will be available at: http://localhost:3000"
print_status "Agent API will be available at: http://localhost:8123"
print_status "Press Ctrl+C to stop all services"

# Start the development servers using pnpm
pnpm run dev

# This line will only be reached if pnpm run dev exits
print_status "Development servers stopped"
