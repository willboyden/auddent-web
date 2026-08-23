# syntax=docker/dockerfile:1

# ---------- build: bundle the Vite app + prerender all routes ----------
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# vite build + scripts/prerender.mjs (the "build" script)
RUN npm run build

# ---------- runtime: nginx serving the built static site ----------
# Non-root by design (mirrors the app image's `USER node`): unprivileged
# port 8080, pid in /tmp, logs to the docker stream, temp files under
# /var/cache/nginx (chowned below). nginx/security-headers.conf must stay
# in lockstep with `productionHeaders` in vite.config.ts (FOLLOWUPS.md #5b).
FROM nginx:stable-alpine
# Deploy freshness: stamp the repo commit (same pattern as the root
# Dockerfile / start-docker.sh). ./start.sh passes
# --build-arg COMMIT=$(git rev-parse HEAD); manual builds get 'unknown'.
ARG COMMIT="unknown"
LABEL org.opencontainers.image.revision=${COMMIT}

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
RUN chown -R nginx:nginx /var/cache/nginx
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

EXPOSE 8080
USER nginx
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
