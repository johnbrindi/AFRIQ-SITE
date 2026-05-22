# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-slim AS builder

# Suppress apt-get warnings during build
ENV DEBIAN_FRONTEND=noninteractive
# Suppress NPM deprecation and audit warnings
ENV NPM_CONFIG_LOGLEVEL=error

# Install OpenSSL (required by Prisma at build time)
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and prisma schema first (for layer caching)
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies cleanly
RUN npm install --no-audit --no-fund

# Copy rest of the source code
COPY . .

# Generate Prisma client FOR LINUX
RUN npx prisma generate

# Build Next.js production bundle
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM node:20-slim AS runner

# Suppress apt-get warnings during runtime build
ENV DEBIAN_FRONTEND=noninteractive

# Install OpenSSL (required by Prisma at runtime)
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security cleanly without system UID warnings
RUN groupadd -r nodejs && \
    useradd -r -g nodejs nextjs

# Copy standalone Next.js build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma schema + the Linux-generated client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
