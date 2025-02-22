const express = require('express');
const multer = require('multer');
const path = require('path');
const { savePlateData } = require('./platerecognizer');
const { calculateParkingFee } = require('./fee');
const { saveData } = require('./pg'); // Updated import to use PostgreSQL

// Create an Express app
const app = express();

// Configure the multer middleware for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage instead of disk storage
  // Only allow images to be uploaded
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});

app.use(express.static('public'));

// Handle the POST request to the /calculateParkingFee route
app.post('/calculateParkingFee', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), async (req, res) => {
  const { image1, image2 } = req.files;
  // Check if files were uploaded
  if (!image1 || !image2) {
    return res.status(400).send('Please upload both images.');
  }
  const buffers = [image1[0].buffer, image2[0].buffer];

  try {
    const { fee, duration, hours, plateData1, plateData2 } = await savePlateData(buffers[0], buffers[1]); // Call the savePlateData function

    // Extract relevant data from plateData1 and plateData2
    const extractedData1 = extractRelevantData(plateData1);
    const extractedData2 = extractRelevantData(plateData2);

    res.send({ fee: fee, duration: duration, hours: hours, plateData1: extractedData1, plateData2: extractedData2 });

  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send({ error: err.message }); // Send the error message to the client
  }
});

// New endpoint for single image analysis
app.post('/analyzePlate', upload.single('image'), async (req, res) => {
  const image = req.file;

  if (!image) {
    return res.status(400).send('Please upload an image.');
  }

  try {
    const plateData = await getPlateData(image.buffer); // Use getPlateData directly
    const extractedData = extractRelevantData(plateData);
    res.send({ plateData: extractedData }); // Send back the extracted API data
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

async function getPlateData(imageBuffer) { // Get the plate data from the API
  const axios = require('axios');
  const FormData = require('form-data');
  const API_TOKEN = process.env.PLATERECOGNIZER_API_TOKEN;
  const formData = new FormData();
  formData.append('upload', imageBuffer, {
    filename: 'image.jpg',
    contentType: 'image/jpeg'
  });

  const response = await axios.post('https://api.platerecognizer.com/v1/plate-reader/', formData, {
    headers: {
      ...formData.getHeaders(),
      'Authorization': `Token ${API_TOKEN}`
    }
  });
  console.log(response.data);
  return response.data;
}

// Function to extract relevant data
function extractRelevantData(plateData) {
  if (!plateData || !plateData.results || plateData.results.length === 0) {
    return { plate: 'Not found', confidence: 'N/A', vehicleType: 'N/A' };
  }

  const result = plateData.results[0];
  return {
    plate: result.plate,
    confidence: result.score,
    vehicleType: result.vehicle ? result.vehicle.type : 'Unknown'
  };
}

// Handle errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send('Bad request');
  } else if (err) {
    console.error(err);
    res.status(500).send('An error occurred while uploading the files');
  } else {
    next();
  }
});

app.listen(5003, () => {
  console.log('Server started on port 5003.');
});