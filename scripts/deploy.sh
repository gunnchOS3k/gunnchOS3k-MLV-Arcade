#!/bin/bash

# gunnchOS3k MLV Arcade Deployment Script
# Deploys to all platforms: Android, iOS, Windows, Web

set -e

echo "🚀 Starting gunnchOS3k MLV Arcade deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build all packages
echo "🔨 Building all packages..."
npm run build

# Deploy to each platform
echo "📱 Deploying to Android..."
npm run deploy:android

echo "🍎 Deploying to iOS..."
npm run deploy:ios

echo "🪟 Deploying to Windows..."
npm run deploy:windows

echo "🌐 Deploying to Web..."
npm run deploy:web

echo "✅ All deployments completed successfully!"
echo "🎮 gunnchOS3k MLV Arcade is now live on all platforms!"
