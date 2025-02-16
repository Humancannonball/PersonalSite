# Plate Recognizer Service

This service is designed to be integrated into a larger web application for recognizing license plates from images. It provides an API for processing images and calculating parking fees based on vehicle type and parking duration.

## Features

-   **License Plate Recognition**: Automatically detects and matches license plates upon entry and exit.
-   **Vehicle Type Identification**: Determines the type of vehicle for accurate fee calculation.
-   **Dynamic Fee Calculation**: Calculates parking fees based on time, vehicle type, and day of the week.
-   **Database Integration**: Stores parking data in a PostgreSQL database for record-keeping.

## Prerequisites

-   Node.js (version 12 or later)
-   PostgreSQL Server
-   Plate Recognizer API Token: Obtain from [Plate Recognizer](https://platerecognizer.com)

## Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/SmartParking.git
    cd SmartParking
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

    This installs the required packages: `axios`, `express`, `multer`, `pg`, and others.

3.  **Configure the Plate Recognizer API Token**

    -   Open `platerecognizer.js`.
    -   Replace `***your token***` with your actual API token:

        ```javascript
        // ...existing code...
        'Authorization': 'Token YOUR_API_TOKEN_HERE'
        // ...existing code...
        ```

4.  **Set Up PostgreSQL Database**

    -   **Start PostgreSQL Server** and ensure it's running.
    -   **Update Database Credentials**

        In `pg.js`, update the PostgreSQL connection details:

        ```javascript
        // filepath: /home/mark/SmartParking/pg.js
        // ...existing code...
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        // ...existing code...
        ```

    -   **Create Database and Table**

        Log into PostgreSQL and run:

        ```sql
        CREATE DATABASE SmartParking;

        \c SmartParking;

        CREATE TABLE PlateData (
            id SERIAL PRIMARY KEY,
            fee DECIMAL(10,2) NOT NULL,
            duration INT NOT NULL,
            hours INT NOT NULL,
            vehicleType VARCHAR(255) NOT NULL,
            timestamp1 TIMESTAMP NOT NULL,
            timestamp2 TIMESTAMP NOT NULL
        );
        ```

    ### Running PostgreSQL Locally

    1.  **Install PostgreSQL:**

        *   **On Debian/Ubuntu:**

            ```bash
            sudo apt-get update
            sudo apt-get install postgresql postgresql-contrib
            ```

        *   **On macOS (using Homebrew):**

            ```bash
            brew install postgresql
            ```

        *   **On Windows:**

            Download the installer from the [PostgreSQL website](https://www.postgresql.org/download/windows/) and follow the instructions.

    2.  **Start PostgreSQL Server:**

        *   **On Linux:**

            ```bash
            sudo systemctl start postgresql
            ```

        *   **On macOS:**

            ```bash
            brew services start postgresql
            ```

        *   **On Windows:**

            The PostgreSQL service should start automatically after installation.  If not, you can start it from the Services application.

    3.  **Access PostgreSQL:**

        ```bash
        sudo -u postgres psql
        ```

    ### Running PostgreSQL on Heroku

    1.  **Create a Heroku Account:**

        If you don't have one already, sign up for a free account at [Heroku](https://www.heroku.com/).

    2.  **Install the Heroku CLI:**

        Download and install the Heroku Command Line Interface (CLI) from the [Heroku website](https://devcenter.heroku.com/articles/heroku-cli).

    3.  **Log in to Heroku:**

        ```bash
        heroku login
        ```

    4.  **Create a Heroku App:**

        ```bash
        heroku create your-app-name
        ```

        Replace `your-app-name` with a unique name for your application.

    5.  **Add the Heroku Postgres Add-on:**

        ```bash
        heroku addons:create heroku-postgresql:hobby-dev
        ```

        This will provision a free-tier PostgreSQL database for your application.

    6.  **Get the Database URL:**

        ```bash
        heroku config:get DATABASE_URL
        ```

        This command will output the connection string for your PostgreSQL database.  Use this value for the `DATABASE_URL` environment variable in your application.

    7.  **Set the `DATABASE_URL` Configuration Variable:**

        In your Heroku app's settings, add a config var called `DATABASE_URL` and set the value to the URL you obtained in the previous step.

        Alternatively, you can set it via the CLI:

        ```bash
        heroku config:set DATABASE_URL="your_database_url"
        ```

        Replace `"your_database_url"` with the actual URL.

## Configuration

-   **Update Rate Settings**

    In `config.json`, ensure the rate settings match your requirements:

    ```json
    {
        "Motorcycle": {
            "weekday": {
                "start": 8,
                "end": 17,
                "rate": 0.5
            },
            // ...existing code...
        },
        // ...existing code...
    }
    ```

## Usage

This service is designed to be consumed by other applications.  Refer to the API documentation for details on how to integrate with this service.

## API Endpoints

-   **/calculateParkingFee**: Accepts two images (entry and exit) and returns the calculated parking fee.

## Project Structure

-   **`app.js`**: Main server file handling routes and server configuration.
-   **`platerecognizer.js`**: Module for interacting with the Plate Recognizer API.
-   **`fee.js`**: Contains logic for calculating parking fees.
-   **`pg.js`**: Handles PostgreSQL database connections and operations.
-   **`config.json`**: Configuration file for parking rates and schedules.
-   **`uploads/`**: Directory where uploaded images are temporarily stored.

## Dependencies

-   axios
-   express
-   multer
-   pg

Install all dependencies using `npm install`.

## Important Notes

-   **API Rate Limits**

    The Plate Recognizer API has rate limits. Ensure you handle delays appropriately in `platerecognizer.js`:

    ```javascript
    // ...existing code...
    // Wait for 1 second between API calls
    await new Promise(resolve => setTimeout(resolve, 1000));
    // ...existing code...
    ```

-   **Error Handling**

    The application includes basic error handling. For production use, consider enhancing this to cover more edge cases.

-   **Security**

    -   Keep your API token secure and do not expose it publicly.
    -   Validate and sanitize all inputs to prevent security vulnerabilities.

## Future Improvements

-   Dockerization

    Containerize the application using Docker for easier deployment.

-   Unit Tests

    Implement unit tests for critical functions.

-   Logging

    Add logging mechanisms to monitor application performance and errors.