# Use base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Install a simple static file server for Node
RUN npm install -g serve

# Expose port 8080 and serve the build folder
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
