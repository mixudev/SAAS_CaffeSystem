# ==========================================
# STAGE 1: Build React static files via Vite
# ==========================================
FROM node:20-alpine as builder

WORKDIR /app

# Copy package list and lockfiles from frontend
COPY frontend/package.json frontend/package-lock.json* ./

# Install npm dependencies (clean install)
RUN npm ci || npm install

# Copy frontend source code
COPY frontend/ .

# Build Vite application (outputs to /app/dist)
RUN npm run build

# ==========================================
# STAGE 2: Serve static files via Nginx
# ==========================================
FROM nginx:1.27-alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy internal Nginx configuration for SPA routing
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
