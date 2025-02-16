# Personal Website and Microservices Project

Welcome to my Personal Website and Microservices Project repository. This project showcases a modern web application architecture utilizing microservices to simulate complex computational models like the Turing Machine, the Iterated Prisoner's Dilemma, and to provide license plate recognition with a parking fee calculation.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview
This project comprises a web frontend and several microservices, each responsible for different functionalities. The architecture is designed to be scalable, maintainable, and easy to deploy using Docker.

## Architecture

### Components

1. **Web Frontend (`web/`)**  
   - Serves the main website and user interface.  
   - Allows users to interact with different simulations and the plate recognizer service.  
   - Built with Node.js and Express.js.

2. **Microservices**  
   - **Prisoner Service (`prisoner-service/`):**  
     Simulates the Iterated Prisoner's Dilemma.  
     Built with Java.  
     Exposes API endpoints for simulation execution.
   - **Turing Service (`turing-service/`):**  
     Simulates a Turing Machine.  
     Built with Java.  
     Exposes API endpoints for running Turing Machine programs.
   - **Digitizer Service (`digitizer-service/`):**  
     Processes uploaded images to extract data points.  
     Built with Node.js.  
     Exposes API endpoints for image processing.
   - **Plate Recognizer Service (`platerecognizer-service/`):**  
     Integrates with the Plate Recognizer API to detect license plates and calculate parking fees.  
     Stores results in a PostgreSQL database.  
     Built with Node.js and Express.js.

3. **Infrastructure**  
   - **Dockerization:**  
     All components are included in a single Dockerfile using multi-stage builds.  
   - **Continuous Integration (`.github/workflows/`):**  
     GitHub Actions workflows automate building and pushing Docker images to Azure Container Registry (ACR).

## Features

- **Interactive Simulations:**
  - **Turing Machine Simulator:**  
    Input custom tape and program configurations; visualize step-by-step operations.
  - **Iterated Prisoner's Dilemma Simulator:**  
    Configure parameters and strategies; analyze outcomes.
  - **Graph Digitizer:**  
    Upload images; extract data points from graphs.
  - **License Plate Recognition:**  
    Upload entry and exit images; calculate parking fees based on vehicle type and duration.

- **Microservices Architecture:**  
  Decoupled services for better scalability and maintainability.

- **Containerization:**  
  Docker containers ensure consistent environments, simplifying deployment.

- **Continuous Integration and Deployment:**  
  Automated workflows for building, testing, and deploying services.

## Technologies Used

- **Frontend:**  
  - HTML, CSS, JavaScript  
  - Express.js

- **Backend Services:**  
  - Node.js (Express)  
  - Java

- **DevOps:**  
  - Docker  
  - Kubernetes  
  - GitHub Actions

- **Database:**  
  - PostgreSQL  

- **Cloud Services:**  
  - Azure Container Registry (ACR)  
  - Azure Kubernetes Service (AKS)

## Setup and Installation

### Prerequisites
- **Local Development:**
  - [Docker](https://www.docker.com/get-started)
  - [Git](https://git-scm.com/downloads)
  - [Node.js](https://nodejs.org/en) (for local testing of Node-based services)
  - [PostgreSQL](https://www.postgresql.org/download/) (if you want to run the Plate Recognizer Service locally)

### Steps to Build and Run Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Humancannonball/PersonalSite.git
   cd PersonalSite