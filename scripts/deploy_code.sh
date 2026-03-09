#!/bin/bash
# Run locally after making code changes (push to git first)
# Usage: ./scripts/deploy_code.sh

set -e
source "$(dirname "$0")/../.env.deploy"
SERVER="root@${SERVER_IP}"
APP_DIR="/opt/personal_website"

echo "==> Pulling latest code on server..."
ssh "$SERVER" "cd $APP_DIR && git pull"

echo "==> Building backend..."
ssh "$SERVER" "cd $APP_DIR/backend && CGO_ENABLED=1 go build -o server ."

echo "==> Building frontend..."
ssh "$SERVER" "cd $APP_DIR/frontend && npm ci && npm run build && cp -r .next/static .next/standalone/.next/static"

echo "==> Restarting services..."
ssh "$SERVER" "systemctl restart personal-website-backend personal-website-frontend"

echo "==> Done! Site live at https://shifasalsabiila.com"
