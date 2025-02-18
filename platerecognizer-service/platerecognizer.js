const axios = require('axios');
const FormData = require('form-data');
const { saveData } = require('./pg'); // Updated import to use PostgreSQL
const { calculateParkingFee } = require('./fee');

const API_TOKEN = process.env.PLATERECOGNIZER_API_TOKEN;

async function getPlateData(imageBuffer) { // Get the plate data from the API
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

async function savePlateData(imageBuffer1, imageBuffer2) {
  // Get the plate data
  const plateData1 = await getPlateData(imageBuffer1);
  // Wait for 1 second, because the API has a limit of 1 request per second
  await new Promise(resolve => setTimeout(resolve, 1000));
  const plateData2 = await getPlateData(imageBuffer2);
  
  // if the plate data is empty, or is not equal in both cases, return error
  if (!plateData1?.results?.[0] || !plateData2?.results?.[0] || 
      plateData1.results[0].plate !== plateData2.results[0].plate) {
    throw new Error('Plate data is empty or not equal');
  }

  // Get timestamps from the API response
  const timestamp1 = new Date(plateData1.timestamp);
  const timestamp2 = new Date(plateData2.timestamp);

  if (!timestamp1.getTime() || !timestamp2.getTime()) {
    throw new Error('Invalid timestamps received from API');
  }

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

  const { fee, duration, hours } = await calculateParkingFee(vehicleType, timestamp1, timestamp2);

  // Add debug logging
  console.log('Data before saving:', {
    fee, duration, hours, vehicleType,
    timestamp1: timestamp1.toISOString(),
    timestamp2: timestamp2.toISOString()
  });

  // Save the data to PostgreSQL
  await saveData(fee, duration, hours, vehicleType, timestamp1, timestamp2);

  // Return an object containing the variables
  return { vehicleType, timestamp1, timestamp2, fee, duration, hours };
}

module.exports = {
  savePlateData
};
