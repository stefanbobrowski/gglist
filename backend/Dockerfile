# --- Stage 1: Build with devDependencies ---
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Stage 2: Runtime image with only production code ---
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/index.js"]
