FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

# Add this line to include the .env.production
COPY .env.production .env.production

COPY . .

# Tell Vite to use production mode (loads .env.production)
RUN npm run build -- --mode production

EXPOSE 8080

CMD [ "npx", "vite", "preview", "--port", "8080", "--host", "0.0.0.0" ]
