# Use an official Node.js image as the build stage
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Use an official OpenJDK image as the runtime stage
FROM eclipse-temurin:17-jre

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