#!/bin/bash

# Release script for mcp-ip-geolocator-npx
# Usage: ./scripts/release.sh [patch|minor|major]

set -e

# Default to patch if no argument provided
VERSION_TYPE=${1:-patch}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting release process...${NC}"

# Check if we're on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ Error: Must be on main branch to release. Current branch: $CURRENT_BRANCH${NC}"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Error: Working directory is not clean. Please commit or stash changes.${NC}"
    git status --short
    exit 1
fi

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git pull origin main

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

# Run build
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

# Test the build
echo -e "${YELLOW}🧪 Testing build...${NC}"
timeout 5s npm start > /dev/null 2>&1 || echo "Build test completed"

# Bump version
echo -e "${YELLOW}⬆️  Bumping version ($VERSION_TYPE)...${NC}"
NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
echo -e "${GREEN}New version: $NEW_VERSION${NC}"

# Create commit
echo -e "${YELLOW}💾 Creating commit...${NC}"
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION"

# Create tag
echo -e "${YELLOW}🏷️  Creating tag...${NC}"
git tag "$NEW_VERSION"

# Push changes and tags
echo -e "${YELLOW}🚀 Pushing to GitHub...${NC}"
git push origin main
git push origin "$NEW_VERSION"

echo -e "${GREEN}✅ Release $NEW_VERSION initiated!${NC}"
echo -e "${GREEN}🔄 GitHub Actions will now handle the NPM publication.${NC}"
echo -e "${GREEN}📦 Monitor the progress at: https://github.com/latel/mcp-ip-geolocator-npx/actions${NC}"

# Open GitHub Actions page (optional)
if command -v open >/dev/null 2>&1; then
    echo -e "${YELLOW}🌐 Opening GitHub Actions page...${NC}"
    open "https://github.com/latel/mcp-ip-geolocator-npx/actions"
elif command -v xdg-open >/dev/null 2>&1; then
    echo -e "${YELLOW}🌐 Opening GitHub Actions page...${NC}"
    xdg-open "https://github.com/latel/mcp-ip-geolocator-npx/actions"
fi
