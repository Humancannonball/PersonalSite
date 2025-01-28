# Use the latest Node.js LTS version
FROM docker.io/node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "index.js"]