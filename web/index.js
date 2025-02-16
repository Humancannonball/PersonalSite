const express = require('express');
const axios = require('axios');
const path = require('path');
// const fileUpload = require('express-fileupload'); // Removed
const app = express();
const port = process.env.PORT || 8080;

// // Enable file uploads
// app.use(fileUpload()); // Removed
app.use(express.json());

// Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Removed
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/', express.static(path.join(__dirname, 'public')));

// Load environment variables
require('dotenv').config();

// Set default values for environment variables if they are undefined
const PRISONER_SERVICE_URL = process.env.PRISONER_SERVICE_URL || 'http://localhost:5000';
const TURING_SERVICE_URL = process.env.TURING_SERVICE_URL || 'http://localhost:5001';
const DIGITIZER_SERVICE_URL = process.env.DIGITIZER_SERVICE_URL || 'http://localhost:5002';
// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Serve the prisoner and turing pages
app.get('/prisoner', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'prisoner.html'));
});

app.get('/turing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'turing.html'));
});

// Proxy to prisoner-service
app.get('/runGameTheory', async (req, res) => {
  try {
    const response = await axios.get(`${PRISONER_SERVICE_URL}/run`, {
      params: req.query,
    });
    res.send(response.data);
  } catch (error) {
    console.error('Prisoner service error:', error);
    res.status(500).send({ error: error.toString() });
  }
});

// Proxy to turing-service
app.post('/runTuring', async (req, res) => {
  try {
    const response = await axios.post(`${TURING_SERVICE_URL}/runTuring`, req.body);
    res.send(response.data);
  } catch (error) {
    console.error('Turing service error:', error);
    res.status(500).send({ error: error.toString() });
  }
});
// Serve the digitizer page
app.get('/digitizer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'digitizer.html'));
});

// Handle graph processing
app.post('/processGraph', async (req, res) => {
  try {
    const response = await axios.post(`${DIGITIZER_SERVICE_URL}/process`, req.body);
    res.send(response.data);
  } catch (error) {
    console.error('Digitizer service error:', error);
    res.status(500).send({ error: error.toString() });
  }
});
// Add with other env variables
const PLATERECOGNIZER_SERVICE_URL = process.env.PLATERECOGNIZER_SERVICE_URL || 'http://localhost:5003';

// Add with other routes
app.get('/platerecognizer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'platerecognizer.html'));
});

// Add proxy route for plate recognition
app.post('/calculateParkingFee', async (req, res) => {
  try {
    const response = await axios.post(`${PLATERECOGNIZER_SERVICE_URL}/calculateParkingFee`, req.body);
    res.send(response.data);
  } catch (error) {
    console.error('Plate recognizer service error:', error);
    res.status(500).send({ error: error.toString() });
  }
});
app.listen(port, () => {
  console.log(`Web Service listening on port ${port}`);
});
