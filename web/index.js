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
    const response = await axios.get('http://prisoner-service:5000/run', {
      params: req.query,
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

// Proxy to turing-service
app.post('/runTuring', async (req, res) => {
  try {
    const response = await axios.post('http://turing-service:5001/runTuring', req.body);
    res.send(response.data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Web Service listening on port ${port}`);
});