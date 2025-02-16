const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Define a function to save the data to the PostgreSQL database
async function saveData(fee, duration, hours, vehicleType, timestamp1, timestamp2) {
  try {
    // Get a connection from the pool
    const client = await pool.connect();

    // Insert the data into the database
    const query = 'INSERT INTO PlateData (fee, duration, hours, vehicleType, timestamp1, timestamp2) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [fee, duration, hours, vehicleType, timestamp1, timestamp2];
    await client.query(query, values);

    // Release the connection back to the pool
    client.release();
  } catch (err) {
    throw new Error(`Failed to save data to database: ${err.message}`);
  }
}

module.exports = {
  saveData
};
