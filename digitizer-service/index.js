const express = require('express');
const app = express();
const port = 5002;

app.use(express.json());

// Simple placeholder endpoint that returns dummy data
app.post('/process', (req, res) => {
  // Mock response with sample data points
  const mockPoints = [
    { x: 0, y: 0 },
    { x: 1, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 6 },
    { x: 4, y: 8 }
  ];
  
  res.send({ points: mockPoints });
});

app.listen(port, () => {
  console.log(`Digitizer Service listening on port ${port}`);
});
// app.post('/process', (req, res) => {
//   const { imageData, settings } = req.body;
  
//   // Call C++ executable with image data and settings
//   const process = spawn('./graph_processor', [
//     JSON.stringify(settings)
//   ]);

//   let output = '';
//   process.stdout.on('data', (data) => {
//     output += data.toString();
//   });

//   process.on('close', (code) => {
//     if (code === 0) {
//       res.send({ points: JSON.parse(output) });
//     } else {
//       res.status(500).send({ error: 'Processing failed' });
//     }
//   });
// });
