FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--port", "4173", "--host"]
