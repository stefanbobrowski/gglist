# --- Stage 1: Build with devDependencies ---
FROM node:18-slim AS builder

WORKDIR /app

# Copy just enough to install deps and build
COPY package*.json tsconfig.json ./
RUN npm install

# Copy the source code
COPY src ./src

# Build the TypeScript project
RUN npm run build

# --- Stage 2: Runtime image with only what's needed to run ---
FROM node:18-slim

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the built output from Stage 1
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/index.js"]
