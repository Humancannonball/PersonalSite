#!/bin/bash
set -e

# Install postgresql-client
apt-get update
apt-get install -y postgresql-client

# Wait for the database to be ready
until PGPASSWORD=password psql -h db -U root -d postgres -c '\q'; do
  echo "Waiting for database to be ready..."
  sleep 2
done

# Create database if it doesn't exist
PGPASSWORD=password psql -h db -U root -d postgres <<EOF
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'SmartParking') THEN
        CREATE DATABASE "SmartParking";
    END IF;
END
\$\$;
EOF

# Connect to the database and create table if it doesn't exist
PGPASSWORD=password psql -h db -U root -d SmartParking <<EOF
CREATE TABLE IF NOT EXISTS PlateData (
    id SERIAL PRIMARY KEY,
    fee DECIMAL(10,2) NOT NULL,
    duration INT NOT NULL,
    hours INT NOT NULL,
    vehicleType VARCHAR(255) NOT NULL,
    timestamp1 TIMESTAMP NOT NULL,
    timestamp2 TIMESTAMP NOT NULL
);
EOF

echo "Database initialized successfully!"

# Start the application services
cd /web && node index.js & \
cd /prisoner-service && node index.js & \
cd /turing-service && node index.js & \
cd /digitizer-service && node index.js & \
cd /platerecognizer-service && node app.js & \
wait