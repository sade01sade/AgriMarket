# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for dependency caching
COPY package*.json .
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────────────
FROM nginx:alpine

# Copy built React files into Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx config with ours
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80