# Deployment Guide — Puthenpurayil Doors CRM (AWS EC2 / Docker)

This repository includes a multi-stage production **Dockerfile**, **nginx.conf**, and **docker-compose.yml** ready for production deployment on any Linux server, AWS EC2 instance, or VPS.

---

## 🚀 Quick Start on your Server (AWS EC2 / Linux)

### Step 1: Clone or Copy repository to your Server
```bash
git clone <your-repository-url> crm
cd crm
```
*(Or transfer the project folder using SCP / SFTP)*

### Step 2: Run Docker Compose
```bash
docker compose up -d --build
```

That's it! Your CRM application will now build automatically in a production Nginx container and start listening on port `80`.

---

## 📄 Docker Configuration Overview

1. **Dockerfile**:
   - **Stage 1 (Builder)**: Uses `node:26-alpine` to install dependencies and run `npm run build` to generate compiled static assets.
   - **Stage 2 (Production Server)**: Uses lightweight `nginx:alpine` to serve assets with Gzip compression and Single-Page-Application (SPA) client-side routing fallback.

2. **docker-compose.yml**:
   - Container Name: `puthenpurayil_crm`
   - Port Mapping: `80:80` (External port 80 maps to Nginx port 80 inside container)
   - Restart Policy: `always` (Auto-restarts on reboot or failure)

---

## 🛠️ Useful Docker Commands

- **Check running status**:
  ```bash
  docker compose ps
  ```

- **View container logs**:
  ```bash
  docker compose logs -f
  ```

- **Stop application**:
  ```bash
  docker compose down
  ```

- **Rebuild and restart after updates**:
  ```bash
  docker compose up -d --build
  ```

---

## 🔒 AWS EC2 Security Group Note

When running on AWS EC2, make sure your EC2 **Security Group** allows inbound traffic on **HTTP (Port 80)** and optionally **HTTPS (Port 443)** if you configure SSL/Certbot.
