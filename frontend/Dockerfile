# --- Stage 1: Build app with devDependencies ---
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Serve built files with Vite Preview ---
FROM node:18-slim

WORKDIR /app

# Install Vite (needed to serve)
COPY package*.json ./
RUN npm install --omit=dev

# Copy only the built output
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["npx", "vite", "preview", "--port", "8080", "--host", "0.0.0.0"]
