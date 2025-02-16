const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { saveData } = require('./pg'); // Updated import to use PostgreSQL

async function getPlateData(imagePath) { // Get the plate data from the API
  const formData = new FormData();
  formData.append('upload', fs.createReadStream(imagePath));

  const response = await axios.post('https://api.platerecognizer.com/v1/plate-reader/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Token ***your token***'
    }
  });
  console.log(response.data);
  return response.data;
}

async function savePlateData(imagePath1, imagePath2) {
  // Get the plate data
  const plateData1 = await getPlateData(imagePath1);
  // Wait for 1 second, because the API has a limit of 1 request per second
  await new Promise(resolve => setTimeout(resolve, 1000));
  const plateData2 = await getPlateData(imagePath2);
  // if the plate data is empty, or is not equal in both cases, return error
  if (!plateData1 || !plateData2 || plateData1.results[0].plate !== plateData2.results[0].plate) {
    throw new Error('Plate data is empty or not equal');
  }
  const timestamp1 = plateData1.timestamp;
  const timestamp2 = plateData2.timestamp;
  const score = plateData1.results[0].score;
  if (score < 0.3) { //according to API documentation
    throw new Error('Score is too low');
  }
  const vehicleScore = plateData1.results[0].vehicle.score;
  if (vehicleScore < 0.3) {
    throw new Error('Vehicle type is undefined');
  }
  let vehicleType = plateData1.results[0].vehicle.type;
  if (vehicleType === 'SUV') { // According to the task
    vehicleType = 'Car';
  }

  // Save the data to PostgreSQL
  await saveData(fee, duration, hours, vehicleType, timestamp1, timestamp2);

  // Return an object containing the variables
  return { vehicleType, timestamp1, timestamp2 };
}

module.exports = {
  savePlateData
};
