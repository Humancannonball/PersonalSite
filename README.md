# Personal Website and Microservices Project

Welcome to my Personal Website and Microservices Project repository. This project showcases a modern web application architecture utilizing microservices to simulate complex computational models like the Turing Machine and the Iterated Prisoner's Dilemma. 

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

This project comprises a web frontend and several microservices, each responsible for different computational simulations. The architecture is designed to be scalable, maintainable, and easy to deploy using Docker.

## Architecture

### Components

1. **Web Frontend (`web/`)**
    - Serves the main website and user interface.
    - Allows users to interact with different simulations.
    - Built with Node.js and Express.js.

2. **Microservices**
    - **Prisoner Service (`prisoner-service/`):**
        - Simulates the Iterated Prisoner's Dilemma.
        - Built with Java.
        - Exposes API endpoints for simulation execution.
    - **Turing Service (`turing-service/`):**
        - Simulates a Turing Machine.
        - Built with Java.
        - Exposes API endpoints for running Turing Machine programs.

3. **Infrastructure**
    - **Dockerization:**
        - All components are included in a single Dockerfile using multi-stage builds.
    - **Continuous Integration (`.github/workflows/`):**
        - GitHub Actions workflows automate building and pushing Docker images to Azure Container Registry (ACR).

## Features

- **Interactive Simulations:**
    - **Turing Machine Simulator:**
        - Input custom tape and program configurations.
        - Visualize the Turing Machine's operations step-by-step.
    - **Iterated Prisoner's Dilemma Simulator:**
        - Configure game parameters and strategies.
        - Analyze outcomes based on different strategies.

- **Microservices Architecture:**
    - Decoupled services for better scalability and maintainability.
    - Each service can be developed, deployed, and scaled independently.

- **Containerization:**
    - Docker containers ensure consistent environments across development and production.
    - Simplifies deployment and scaling using Kubernetes.

- **Continuous Integration and Deployment:**
    - Automated workflows for building, testing, and deploying services.
    - Ensures rapid and reliable delivery of updates.

## Technologies Used

- **Frontend:**
    - HTML, CSS, JavaScript
    - jQuery
    - Express.js

- **Backend Services:**
    - Java
    - Express.js (Node.js)

- **DevOps:**
    - Docker
    - Kubernetes
    - GitHub Actions

- **Cloud Services:**
    - Azure Container Registry (ACR)
    - Azure Kubernetes Service (AKS)

## Setup and Installation

### Prerequisites

- **Local Development:**
    - [Docker](https://www.docker.com/get-started)
    - [Git](https://git-scm.com/downloads)

### Steps to Build and Run Locally

1. **Clone the Repository:**
    ```sh
    git clone https://github.com/Humancannonball/PersonalSite.git
    cd PersonalSite
    ```

2. **Build and Start Services with Docker:**
    ```sh
    docker build -t personal-site .
    docker run -p 8080:8080 -p 5000:5000 -p 5001:5001 personal-site
    ```

3. **Access the Application:**
    - **Web Frontend:** `http://localhost:8080`
    - **Prisoner Service:** `http://localhost:5000`
    - **Turing Service:** `http://localhost:5001`

## Usage

1. **Access the Web Frontend:**
    - Navigate to `http://localhost:8080` in your browser.

2. **Run Simulations:**
    - **Turing Machine:**
        - Input the initial tape and program.
        - Submit to visualize the machine's operation.
    - **Iterated Prisoner's Dilemma:**
        - Configure game parameters.
        - Run simulations to analyze strategies.

3. **View Results:**
    - Simulation outputs are displayed on the frontend interface.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**
    ```sh
    git checkout -b feature/YourFeature
    ```
3. **Commit Your Changes**
    ```sh
    git commit -m "Add your feature"
    ```
4. **Push to the Branch**
    ```sh
    git push origin feature/YourFeature
    ```
5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Inspired by the [Turing Machine simulation](https://morphett.info/turing/turing.html).
- Utilizes open-source technologies and frameworks.
