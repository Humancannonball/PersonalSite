# Plate Recognizer GUI

Plate Recognizer GUI website is a cloud-native application that uses Node.js, Vue.js, and PostgreSQL to provide a smart parking solution. It utilizes the [Plate Recognizer API](https://platerecognizer.com) to detect vehicle license plates from images and calculates parking fees based on vehicle type and parking duration.

## Features

- **License Plate Recognition**: Automatically detects and matches license plates upon entry and exit.
- **Vehicle Type Identification**: Determines the type of vehicle for accurate fee calculation.
- **Dynamic Fee Calculation**: Calculates parking fees based on time, vehicle type, and day of the week.
- **Database Integration**: Stores parking data in a PostgreSQL database for record-keeping.
- **User-Friendly Interface**: Provides a simple web interface for uploading images.

## Prerequisites

- **Node.js** (version 12 or later)
- **PostgreSQL Server**
- **Plate Recognizer API Token**: Obtain from [Plate Recognizer](https://platerecognizer.com)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/SmartParking.git
   cd SmartParking
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

   This installs the required packages: `axios`, `express`, `multer`, `pg`, and others.

3. **Configure the Plate Recognizer API Token**

   - Open `platerecognizer.js`.
   - Replace `***your token***` with your actual API token:

     ```javascript
     // ...existing code...
     'Authorization': 'Token YOUR_API_TOKEN_HERE'
     // ...existing code...
     ```

4. **Set Up PostgreSQL Database**

   - **Start PostgreSQL Server** and ensure it's running.
   - **Update Database Credentials**

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

   - **Create Database and Table**

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

## Configuration

- **Update Rate Settings**

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

1. **Start the Application**

   ```bash
   node app.js
   ```

   The server will start on `http://localhost:3000`.

2. **Access the Web Interface**

   Open a browser and navigate to `http://localhost:3000`.

3. **Upload Vehicle Images**

   - Upload an image of the vehicle entering the parking.
   - Upload an image of the same vehicle exiting the parking.

4. **View Parking Fee**

   After processing, the application displays the calculated parking fee based on the provided images.

## Project Structure

- **`app.js`**

  Main server file handling routes and server configuration.

- **`public/index.html`**

  Front-end interface built with Vue.js for image uploads and displaying results.

- **`platerecognizer.js`**

  Module for interacting with the Plate Recognizer API.

- **`fee.js`**

  Contains logic for calculating parking fees.

- **`pg.js`**

  Handles PostgreSQL database connections and operations.

- **`config.json`**

  Configuration file for parking rates and schedules.

- **`uploads/`**

  Directory where uploaded images are temporarily stored.

## Dependencies

- **axios**
- **express**
- **multer**
- **pg**
- **vue.js**

Install all dependencies using `npm install`.

## Important Notes

- **API Rate Limits**

  The Plate Recognizer API has rate limits. Ensure you handle delays appropriately in `platerecognizer.js`:

  ```javascript
  // ...existing code...
  // Wait for 1 second between API calls
  await new Promise(resolve => setTimeout(resolve, 1000));
  // ...existing code...
  ```

- **Error Handling**

  The application includes basic error handling. For production use, consider enhancing this to cover more edge cases.

- **Security**

  - Keep your API token secure and do not expose it publicly.
  - Validate and sanitize all inputs to prevent security vulnerabilities.

## Future Improvements

- **Dockerization**

  Containerize the application using Docker for easier deployment.

- **Unit Tests**

  Implement unit tests for critical functions.

- **Logging**

  Add logging mechanisms to monitor application performance and errors.

