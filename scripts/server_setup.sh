#!/bin/bash
# Run this on the server: bash server_setup.sh
set -e

echo "==> Creating systemd services..."

cat > /etc/systemd/system/personal-website-backend.service << 'EOF'
[Unit]
Description=Personal Website Backend
After=network.target

[Service]
WorkingDirectory=/opt/personal_website/backend
ExecStart=/opt/personal_website/backend/server
EnvironmentFile=/opt/personal_website/backend/.env
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/personal-website-frontend.service << 'EOF'
[Unit]
Description=Personal Website Frontend
After=network.target

[Service]
WorkingDirectory=/opt/personal_website/frontend
ExecStart=/usr/bin/node .next/standalone/server.js
Environment=PORT=3000
Environment=HOSTNAME=0.0.0.0
EnvironmentFile=/opt/personal_website/frontend/.env.local
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable personal-website-backend personal-website-frontend
systemctl start personal-website-backend personal-website-frontend
echo "==> Services started!"

echo "==> Configuring nginx..."

cat > /etc/nginx/sites-available/shifasalsabiila.com << 'EOF'
server {
    server_name shifasalsabiila.com www.shifasalsabiila.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /uploads {
        proxy_pass http://localhost:8080;
    }
}
EOF

ln -sf /etc/nginx/sites-available/shifasalsabiila.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
echo "==> Nginx configured!"

echo "==> Running certbot..."
certbot --nginx -d shifasalsabiila.com -d www.shifasalsabiila.com
echo "==> Done! Site should be live at https://shifasalsabiila.com"
