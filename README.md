# Personal Website and Microservices Project

This repository contains the source code and configurations for my personal website and its associated microservices. The project demonstrates my expertise in web development, microservices architecture, containerization, and cloud deployment using Kubernetes and Terraform.

## Overview

### Web Frontend (`web/`)

- **Description:** A Node.js application serving as my personal website.
- **Features:**
  - Interactive simulations of the Iterated Prisoner's Dilemma and a Turing Machine.
  - Detailed sections about my projects, skills, passions, and contact information.
  - Image upload functionality with an image gallery.

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

