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

# Stage 4: Build digitizer-service
FROM docker.io/node:20-alpine AS digitizer-build
WORKDIR /digitizer-service
COPY digitizer-service/package.json ./
RUN npm install
COPY digitizer-service ./

FROM docker.io/node:20-alpine AS platerecognizer-build
WORKDIR /platerecognizer-service
COPY platerecognizer-service/package*.json ./
RUN npm install
COPY platerecognizer-service ./
RUN mkdir uploads

# Stage 5: Runtime image
FROM docker.io/eclipse-temurin:21-jre

# Set working directories for each service
WORKDIR /web
COPY --from=web-build /web ./
WORKDIR /prisoner-service
COPY --from=prisoner-build /prisoner-service ./
WORKDIR /turing-service
COPY --from=turing-build /turing-service ./
WORKDIR /digitizer-service
COPY --from=digitizer-build /digitizer-service ./
WORKDIR /platerecognizer-service
COPY --from=platerecognizer-build /platerecognizer-service ./


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
EXPOSE 5002
EXPOSE 5003

# Update CMD to include platerecognizer service
CMD sh -c "cd /web && node index.js & \
           cd /prisoner-service && node index.js & \
           cd /turing-service && node index.js & \
           cd /digitizer-service && node index.js & \
           cd /platerecognizer-service && node app.js & \
           wait"