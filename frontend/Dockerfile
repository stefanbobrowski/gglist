# --- Stage 1: Build with devDependencies ---
FROM node:18-slim AS builder

WORKDIR /app

# Install full deps for build
COPY package*.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Serve with Vite preview ---
FROM node:18-slim

WORKDIR /app

# Install only prod dependencies (needed for `vite preview`)
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app only
COPY --from=builder /app/dist ./dist

# Set environment variables (optional)
ENV NODE_ENV=production

EXPOSE 8080
CMD ["npx", "vite", "preview", "--port", "8080", "--host", "0.0.0.0"]
