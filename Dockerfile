# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: Runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies for backend
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy backend build and seed data
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/src/data ./dist/data

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 5000

CMD ["node", "dist/server.js"]
