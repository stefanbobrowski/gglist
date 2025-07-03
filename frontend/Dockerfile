FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# No .env needed — prod config is hardcoded
RUN npm run build

EXPOSE 8080
CMD ["npx", "vite", "preview", "--port", "8080", "--host", "0.0.0.0"]

