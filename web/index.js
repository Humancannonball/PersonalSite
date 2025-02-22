const express = require('express');
const axios = require('axios');
const path = require('path');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 8080;
const { Blob } = require('buffer'); // Import Blob from the buffer module
const FormData = require('form-data'); // Import FormData from the form-data package
const fs = require('fs');

app.use(express.json());

// Serve static files
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
const storage = multer.memoryStorage(); // Use memory storage instead of disk storage

const upload = multer({ storage: storage });

app.post('/calculateParkingFee', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), async (req, res) => {
  try {
    const formData = new FormData();
    // Convert the buffer to a Blob
    const image1Buffer = req.files.image1[0].buffer;
    const image2Buffer = req.files.image2[0].buffer;

    // Create a temporary file for image1
    const image1Path = path.join(__dirname, 'temp_image1.jpg');
    fs.writeFileSync(image1Path, image1Buffer);
    formData.append('image1', fs.createReadStream(image1Path), req.files.image1[0].originalname);

    // Create a temporary file for image2
    const image2Path = path.join(__dirname, 'temp_image2.jpg');
    fs.writeFileSync(image2Path, image2Buffer);
    formData.append('image2', fs.createReadStream(image2Path), req.files.image2[0].originalname);

    const response = await axios.post(`${PLATERECOGNIZER_SERVICE_URL}/calculateParkingFee`, formData, {
      headers: formData.getHeaders()
    });
    res.send(response.data);
  } catch (error) {
    console.error('Plate recognizer service error:', error);
    res.status(500).send({ error: error.toString() });
  } finally {
    // Clean up temporary files
    fs.unlinkSync(path.join(__dirname, 'temp_image1.jpg'));
    fs.unlinkSync(path.join(__dirname, 'temp_image2.jpg'));
  }
});

app.post('/analyzePlate', upload.single('image'), async (req, res) => {
  try {
    const formData = new FormData();
    const imageBuffer = req.file.buffer;

    // Create a temporary file for the image
    const imagePath = path.join(__dirname, 'temp_image.jpg');
    fs.writeFileSync(imagePath, imageBuffer);
    formData.append('image', fs.createReadStream(imagePath), req.file.originalname);

    const response = await axios.post(`${PLATERECOGNIZER_SERVICE_URL}/analyzePlate`, formData, {
      headers: formData.getHeaders()
    });
    res.send(response.data);
  } catch (error) {
    console.error('Plate recognizer service error:', error);
    res.status(500).send({ error: error.toString() });
  } finally {
    // Clean up temporary files
    fs.unlinkSync(path.join(__dirname, 'temp_image.jpg'));
  }
});

app.listen(port, () => {
  console.log(`Web Service listening on port ${port}`);
});