# Multi-stage Dockerfile for PersonalSite

# Stage 1: Build web service
FROM docker.io/node:20-alpine AS web-build
WORKDIR /web
COPY web/package*.json ./
RUN npm ci
COPY web ./
RUN npm run build

# Stage 2: Build prisoner-service
FROM docker.io/node:20-alpine AS prisoner-build
WORKDIR /prisoner-service
COPY prisoner-service/package*.json ./
RUN npm ci
COPY prisoner-service ./
RUN npm run build

# Stage 3: Build turing-service
FROM docker.io/node:20-alpine AS turing-build
WORKDIR /turing-service
COPY turing-service/package*.json ./
RUN npm ci
COPY turing-service ./
RUN npm run build

# Stage 4: Runtime image
FROM docker.io/eclipse-temurin:21-jre

# Set working directories for each service
WORKDIR /web
COPY --from=web-build /web ./
WORKDIR /prisoner-service
COPY --from=prisoner-build /prisoner-service ./
WORKDIR /turing-service
COPY --from=turing-build /turing-service ./

# Install Node.js runtime
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy JAR files for Java services
COPY prisoner-service/GameTheory.jar /prisoner-service/
COPY turing-service/TuringMachine.jar /turing-service/

# Expose ports
EXPOSE 8080
EXPOSE 5000
EXPOSE 5001

# Start the web service
CMD sh -c "cd /web && node index.js & cd /prisoner-service && node index.js & cd /turing-service && node index.js & wait"
