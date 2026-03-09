#!/bin/bash
# Run this locally to push code + assets to the VPS.
# Usage: ./scripts/deploy.sh user@your-server-ip

set -e

SERVER="${1:?Usage: deploy.sh user@server-ip}"
APP_DIR="/opt/personal_website"

echo "==> Syncing code..."
rsync -az --exclude='.git' --exclude='frontend/node_modules' --exclude='frontend/.next' \
  --exclude='backend/data.db' \
  ./ "$SERVER:$APP_DIR/"

echo "==> Syncing database..."
rsync -az backend/data.prod.db "$SERVER:$APP_DIR/backend/data.db"

echo "==> Syncing uploads..."
rsync -az backend/uploads/ "$SERVER:$APP_DIR/backend/uploads/"

echo "==> Building backend..."
ssh "$SERVER" "cd $APP_DIR/backend && go build -o server ."

echo "==> Building frontend..."
ssh "$SERVER" "cd $APP_DIR/frontend && npm ci && npm run build"

echo "==> Restarting services..."
ssh "$SERVER" "sudo systemctl restart personal-website-backend personal-website-frontend"

echo "==> Done! Site should be live at https://shifasalsabiila.com"
