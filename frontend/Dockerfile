# --- Stage 1: Build with devDependencies ---
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Final runtime image ---
FROM node:18-slim

WORKDIR /app

# Copy built code and install runtime dependencies
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 8080
CMD ["node", "dist/index.js"]
