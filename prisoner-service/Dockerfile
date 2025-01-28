# Use an official Node.js image as the build stage
FROM docker.io/node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Use an official Eclipse Temurin Java 21 runtime image
FROM docker.io/eclipse-temurin:21-jre

# Set working directory
WORKDIR /app

# Copy compiled Node.js app from build stage
COPY --from=build /app /app

# Install Node.js runtime
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Ensure the GameTheory.jar is in the working directory
COPY GameTheory.jar /app/

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]