# Personal Website and Microservices Project

This repository contains the source code and configurations for my personal website and its associated microservices. The project demonstrates my expertise in web development, microservices architecture, containerization. The website is down right now, since I am rewriting it to use microservices.

## Overview

### Web Frontend (`web/`)

- **Description:** A Node.js application serving as my personal website.
- **Features:**
  - Interactive simulations of the Iterated Prisoner's Dilemma and a Turing Machine.
  - Detailed sections about my projects, skills, passions, and contact information.

### Microservices

- **Prisoner Service (`prisoner-service/`):**
  - Runs a Java application simulating the Iterated Prisoner's Dilemma.
  - Provides an API endpoint for the frontend to fetch simulation results.
- **Turing Service (`turing-service/`):**
  - Runs a Java application simulating a Turing Machine.
  - Provides an API endpoint for the frontend to execute Turing Machine programs.

### Infrastructure

- **Dockerization:**
  - Each component has a Dockerfile for containerization.
  - Optimized multi-stage builds for efficient image sizes.
- **Continuous Integration (`.github/workflows/`):**
  - GitHub Actions workflows automate building and pushing Docker images to Azure Container Registry (ACR).
- **Deployment (in separate repository):**
  - Uses Terraform for provisioning Azure Kubernetes Service (AKS) clusters.
  - Kubernetes manifests manage the deployment of services.

## Local Development Environment Setup

### Prerequisites

- Docker
- Docker Compose

### Steps to Build and Run the Containers Locally

1. Clone the repository:
   ```sh
   git clone https://github.com/Humancannonball/PersonalSite.git
   cd PersonalSite
   ```

2. Build and start the containers using Docker Compose:
   ```sh
   docker-compose up --build
   ```

3. Access the services:
   - Web frontend: `http://localhost:8080`
   - Prisoner service: `http://localhost:5000`
   - Turing service: `http://localhost:5001`
