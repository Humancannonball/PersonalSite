const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5002;

const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.post('/process', upload.single('image'), (req, res) => {
  const { settings } = req.body;
  const imagePath = req.file.path;

  // Mock response with sample data points
  const mockPoints = [
    { x: 0, y: 0 },
    { x: 1, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 6 },
    { x: 4, y: 8 }
  ];

  // Simulate processing delay
  setTimeout(() => {
    // Delete the uploaded file after processing
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Failed to delete uploaded file:', err);
      }
    });

    res.send({ points: mockPoints });
  }, 2000);
});

app.listen(port, () => {
  console.log(`Digitizer Service listening on port ${port}`);
});
