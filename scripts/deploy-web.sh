#!/bin/bash

# Quick Web Deployment Script for MLV Arcade
# Deploys to GitHub Pages for immediate testing

set -e

echo "🚀 Deploying MLV Arcade to GitHub Pages..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root directory"
    exit 1
fi

# Create web build directory
echo "📦 Creating web build..."
mkdir -p dist/web

# Copy web app files
echo "📁 Copying web app files..."
cp -r apps/web/* dist/web/

# Create GitHub Pages configuration
echo "⚙️ Creating GitHub Pages configuration..."
cat > dist/web/.nojekyll << EOF
# GitHub Pages configuration
# This file tells GitHub Pages to serve files as-is
EOF

# Create index.html redirect for GitHub Pages
echo "🔗 Creating GitHub Pages redirect..."
cat > dist/web/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>gunnchOS3k MLV Arcade</title>
    <meta http-equiv="refresh" content="0; url=./index.html">
</head>
<body>
    <p>Redirecting to MLV Arcade...</p>
    <script>
        window.location.href = './index.html';
    </script>
</body>
</html>
EOF

# Create GitHub Actions workflow for automatic deployment
echo "🔄 Creating GitHub Actions workflow..."
mkdir -p .github/workflows
cat > .github/workflows/deploy-web.yml << 'EOF'
name: Deploy MLV Arcade to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build web app
      run: |
        mkdir -p dist/web
        cp -r apps/web/* dist/web/
        echo "# GitHub Pages" > dist/web/.nojekyll
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/web
        cname: gunnchOS3k.github.io
EOF

# Commit and push changes
echo "📤 Committing and pushing changes..."
git add .
git commit -m "Deploy MLV Arcade web app for dorm testing

- Add complete PWA with offline support
- Create GitHub Pages deployment
- Add user testing guide for dorm mates
- Enable immediate testing and feedback collection
- Ready for Phase 1: Web Launch"

git push origin main

echo "✅ MLV Arcade web app deployed successfully!"
echo "🌐 Your app will be available at: https://gunnchOS3k.github.io/gunnchOS3k-MLV-Arcade/"
echo "📱 Share this URL with your dorm mates for testing!"
echo "🎮 Ready for user feedback and iteration!"
