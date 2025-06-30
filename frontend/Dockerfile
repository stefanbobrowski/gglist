FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env.production .env.production

COPY . .

# Make sure Vite uses production mode
RUN npm run build -- --mode production

EXPOSE 8080

CMD [ "npx", "vite", "preview", "--port", "8080", "--host", "0.0.0.0" ]
