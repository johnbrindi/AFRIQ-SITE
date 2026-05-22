# Deployment Guide & Troubleshooting Walkthrough

This document outlines how the **AFRIQ-SITE** containerization, build, and deployment issues were resolved, along with step-by-step instructions on how to build, push, and deploy the application to your Linux VPS.

---

## 🛠️ Summary of Key Fixes

### 1. Database Connection and Prisma Engine Binary Failures
* **Problem:** Prisma client failed at runtime on the Linux VPS with `PrismaClientInitializationError`, reporting that it could not locate the Query Engine for runtime `debian-openssl-3.0.x`.
* **Root Cause:** The Prisma client was initially generated for "windows" during your local installation/build. When the project was copied into a Linux container, the container tried to use the Windows-compiled Prisma client instead of the Linux engine.
* **Resolution:**
  1. Updated [schema.prisma](file:///c:/Users/INTER-TECH/Desktop/AFRIQ-SITE/prisma/schema.prisma) to support Linux targets:
     ```prisma
     generator client {
       provider      = "prisma-client-js"
       binaryTargets = ["native", "debian-openssl-3.0.x"]
     }
     ```
  2. Redesigned the [Dockerfile](file:///c:/Users/INTER-TECH/Desktop/AFRIQ-SITE/Dockerfile) as a robust **multi-stage build**:
     - **Stage 1 (Builder):** Uses a clean `node:20-slim` Debian base, installs the required `openssl` library, runs `npm install`, and explicitly triggers `npx prisma generate` to compile the query engine binary specifically for Linux (`debian-openssl-3.0.x`).
     - **Stage 2 (Runner):** Installs `openssl` for runtime, copies the generated static standalone server, and securely passes the generated Linux Prisma Client files from the builder stage.

---

### 2. DNS & Package Download Failures during Docker Build
* **Problem:** Alpine package registry (`apk`) failed to resolve domains and download packages like `libc6-compat` and `openssl` due to transient DNS and network configurations on the local Docker engine.
* **Resolution:** Switched the Docker base image from Alpine `node:20-alpine` to Debian-based `node:20-slim`. The Debian-based `node:20-slim` image already comes prepackaged with key dynamic linkers and handles package installation via `apt-get` with robust built-in retry parameters, permanently eliminating Alpine DNS registry failures.

---

### 3. Build-Time ETIMEDOUT (Google Fonts Download Block)
* **Problem:** Docker's isolated network environment could not reach Google Font servers during the Next.js `npm run build` phase, causing the compiler to hang and crash with network timeout errors.
* **Resolution:** Swapped Next.js's build-time `next/font/google` fetch mechanism out of the layout. Instead, we injected `@import` directives directly in [globals.css](file:///c:/Users/INTER-TECH/Desktop/AFRIQ-SITE/app/globals.css) so font loading is gracefully deferred to the browser at runtime:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:wght@400..900&display=swap');
  ```
  This completely decoupled the Next.js production build from the internet, ensuring ultra-fast, local, network-independent compilation.

---

## 🐳 How to Build & Push to Docker Hub

To build a fresh version of your Docker image and push it to Docker Hub, open a Git Bash or MINGW terminal at the root of the project and execute the following commands:

### Step 1: Login to your Docker Hub Account
```bash
docker login
```
*Enter your Docker Hub username and password when prompted.*

### Step 2: Build the Docker Image
```bash
docker build --no-cache -t degreat12/afriq-site:latest .
```
*(This builds a lightweight, production-ready, standalone Next.js container.)*

### Step 3: Push the Image to Docker Hub
```bash
docker push degreat12/afriq-site:latest
```

---

## 🚀 How to Deploy on your VPS Machine

Once the image is pushed, follow these steps to pull and run it on your Linux VPS.

### Step 1: Prepare the `docker-compose.yml`
Save the following configuration as `docker-compose.yml` in your deployment directory on the VPS:

```yaml
version: '3.8'

services:
  afriq-site:
    image: degreat12/afriq-site:latest
    container_name: afriq-site
    restart: always
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - DIRECT_URL=${DIRECT_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}
      - AUTH_TRUST_HOST=true
      - PORT=3000
    extra_hosts:
      - "host.docker.internal:host-gateway"
    networks:
      - afriq-network

networks:
  afriq-network:
    driver: bridge
```

### Step 2: Set up Environment Variables
On the VPS, create a `.env` file in the same directory as `docker-compose.yml` to store your secrets securely:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@hostname:port/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@hostname:port/dbname?sslmode=require"

# NextAuth secrets and host configurations
NEXTAUTH_SECRET="use-a-strong-random-key"
NEXTAUTH_URL="https://your-domain.com"
AUTH_TRUST_HOST="true"
```

> [!IMPORTANT]
> **NextAuth Untrusted Host Fix:** In Docker environments and production behind reverse proxies, NextAuth requires `AUTH_TRUST_HOST=true` to trust the Host headers forwarded by the proxy. Without it, you will see `UntrustedHost: Host must be trusted` errors in your logs. We have added this to both the compose file and env file.

### Step 3: Pull & Start the Container on the VPS
Execute the following commands on your VPS terminal:

```bash
# Pull the latest image from Docker Hub
docker compose pull

# Start the container in detached (background) mode
docker compose up -d

# Verify that the container is running smoothly
docker ps

# Check active application logs
docker logs afriq-site -f
```

---

## 🔍 Troubleshooting VPS Connection & Startup Issues

If you see connection issues or pool timeouts in your logs, use the following guide:

### 1. Timed out fetching a new connection from the connection pool (Prisma)
* **What is happening:** Prisma client is running, but it cannot connect to your PostgreSQL database.
* **Troubleshooting Steps:**
  1. **If your Database runs on the VPS Host (outside Docker):** 
     Inside the Docker container, `localhost` refers to the container itself, not your VPS host. 
     - **Fix:** Update your `DATABASE_URL` in `.env` to use **`host.docker.internal`** instead of `localhost` or `127.0.0.1`. (e.g. `postgresql://user:pass@host.docker.internal:5432/dbname`).
  2. **If your Database runs in a separate Docker container:**
     - **Fix:** Put both the app container and database container on the same Docker network and use the database container's `container_name` as the hostname in `DATABASE_URL`.
  3. **If your Database is external (e.g., Supabase / Neon DB):**
     Ensure your VPS allows outgoing connections to port 5432 and that Docker's DNS can resolve public domains.
     - To test DNS inside your running container, run:
       ```bash
       docker exec -it afriq-site ping -c 3 google.com
       ```
     - To check database port connectivity from the VPS, run:
       ```bash
       nc -zv <db-hostname> 5432
       ```

### 2. Database Migrations (Prisma) on VPS
If your database schema has changed and you need to apply migrations to your live production database:
1. Ensure your local `.env` has the correct `DATABASE_URL` pointing to the database.
2. Run the migration from your local developer machine directly to the database:
   ```bash
   npx prisma db push
   ```
   *(Using `db push` is ideal for rapid state syncs, or `npx prisma migrate deploy` if you are using formal migrations.)*
