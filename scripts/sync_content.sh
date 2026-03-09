#!/bin/bash
# Run locally after adding new content (books, movies, uploads, etc.)
# Usage: ./scripts/sync_content.sh

set -e
source "$(dirname "$0")/../.env.deploy"
SERVER="root@${SERVER_IP}"
APP_DIR="/opt/personal_website"

echo "==> Preparing production DB..."
cp backend/data.db backend/data.prod.db
python3 scripts/migrate_urls.py backend/data.prod.db https://shifasalsabiila.com

echo "==> Syncing DB..."
rsync -az backend/data.prod.db "$SERVER:$APP_DIR/backend/data.db"

echo "==> Syncing uploads..."
rsync -az backend/uploads/ "$SERVER:$APP_DIR/backend/uploads/"

echo "==> Restarting backend..."
ssh "$SERVER" "systemctl restart personal-website-backend"

echo "==> Done! Content live at https://shifasalsabiila.com"
