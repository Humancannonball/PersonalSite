const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Validate numeric values
function validateNumber(value) {
  const num = Number(value);
  return !isNaN(num) ? num : 0; // Return 0 if NaN
}

// Define a function to save the data to the PostgreSQL database
async function saveData(fee, duration, hours, vehicleType, timestamp1, timestamp2) {
  try {
    // Validate numeric inputs
    const validFee = validateNumber(fee);
    const validDuration = validateNumber(duration);
    const validHours = validateNumber(hours);
    
    // Ensure vehicleType is a string
    const validVehicleType = String(vehicleType || 'unknown');
    
    // Ensure timestamps are valid
    const validTimestamp1 = timestamp1 instanceof Date ? timestamp1 : new Date(timestamp1);
    const validTimestamp2 = timestamp2 instanceof Date ? timestamp2 : new Date(timestamp2);

    // Get a connection from the pool
    const client = await pool.connect();

    try {
      // Insert the data into the database
      const query = 'INSERT INTO PlateData (fee, duration, hours, vehicleType, timestamp1, timestamp2) VALUES ($1, $2, $3, $4, $5, $6)';
      const values = [validFee, validDuration, validHours, validVehicleType, validTimestamp1, validTimestamp2];
      await client.query(query, values);
    } finally {
      // Always release the connection back to the pool
      client.release();
    }
  } catch (err) {
    console.error('Database error details:', {
      fee, duration, hours, vehicleType,
      timestamp1: timestamp1?.toString(),
      timestamp2: timestamp2?.toString()
    });
    throw new Error(`Failed to save data to database: ${err.message}`);
  }
}

module.exports = {
  saveData
};