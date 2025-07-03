# Use slim version to reduce image size
FROM node:18-slim

# Create app directory
WORKDIR /app

# Install dependencies only if package files change
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Use dist folder as the main entrypoint
EXPOSE 8080
CMD ["node", "dist/index.js"]
