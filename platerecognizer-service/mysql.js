const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'SmartParking',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Define a function to save the data to the database
async function saveData(fee, duration, hours, vehicleType, typestamp1, typestamp2) {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Insert the data into the database
        const [rows, fields] = await connection.execute('INSERT INTO PlateData (fee, duration, hours, vehicleType, typestamp1, typestamp2) VALUES (?, ?, ?, ?, ?, ?)', [fee, duration, hours, vehicleType, typestamp1, typestamp2]);

        // Release the connection back to the pool
        connection.release();

    } catch (err) {
        throw new Error(`Failed to save data to database: ${err.message}`);
    }
}

module.exports = {
    saveData
};