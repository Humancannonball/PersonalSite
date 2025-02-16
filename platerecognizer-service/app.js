const express = require('express');
const multer = require('multer');
const path = require('path');
const { savePlateData } = require('./platerecognizer');
const { calculateParkingFee } = require('./fee');
const { saveData } = require('./pg'); // Updated import to use PostgreSQL


// Create an Express app
const app = express();
// Create a directory to store uploaded files
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Configure the multer middleware for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Use the absolute path
      cb(null, uploadsDir);
    },
    // Set the filename to the current date and time concatenated with the original name of the uploaded file
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  }),
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
  const paths = [image1[0].path, image2[0].path]

  try {
    const plateData = await savePlateData(paths[0], paths[1]); // Call the savePlateData function
    const { vehicleType, timestamp1, timestamp2 } = plateData; // Destructure the plateData object
    const { fee, duration, hours } = await calculateParkingFee(vehicleType, timestamp1, timestamp2); // For presentation purposes
    console.log(fee, duration, hours);
    saveData(fee, duration, hours, vehicleType, timestamp1, timestamp2); // Fixed typo: typestamp -> timestamp
    res.send(`Your parking fee is ${fee} for ${duration} day(s) and ${hours} hour(s).`);

  } catch (err) {
    res.sendStatus(500);
  }
});
// Handle errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send('Bad request');
  } else if (err) {
    res.status(500).send('An error occurred while uploading the files');
  } else {
    next();
  }
});

app.listen(5003, () => {
  console.log('Server started on port 5003.');
});
