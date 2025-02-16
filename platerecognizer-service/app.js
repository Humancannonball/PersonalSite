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
    const plateData = await savePlateData(buffers[0], buffers[1]); // Call the savePlateData function
    const { vehicleType, timestamp1, timestamp2, fee, duration, hours } = plateData; // Destructure the plateData object
    console.log(fee, duration, hours);
    res.send({ fee: fee, duration: duration, hours: hours });

  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send({ error: err.message }); // Send the error message to the client
  }
});

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
