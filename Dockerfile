FROM timbru31/java-node:11-jdk-iron

ARG REFRESHED_AT
ENV REFRESHED_AT $REFRESHED_AT

# Install build tools
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available) for dependency installation
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Command to run your application
CMD ["node", "index.js"]