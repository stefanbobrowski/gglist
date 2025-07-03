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

# Copy built app and package.json for runtime deps
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

EXPOSE 8080
CMD ["node", "dist/index.js"]
