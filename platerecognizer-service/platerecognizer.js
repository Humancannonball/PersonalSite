const axios = require('axios');
const FormData = require('form-data');
const { saveData } = require('./pg');
const { calculateParkingFee } = require('./fee');

const API_TOKEN = process.env.PLATERECOGNIZER_API_TOKEN;

async function getPlateData(imageBuffer) {
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
    throw new Error('License plates do not match or could not be read.');
  }

  // Get timestamps from the API response
  const timestamp1 = new Date(plateData1.timestamp);
  const timestamp2 = new Date(plateData2.timestamp);

  if (!timestamp1.getTime() || !timestamp2.getTime()) {
    throw new Error('Invalid timestamp from API.');
  }

  const score = plateData1.results[0].score;
  if (score < 0.3) {
    throw new Error('Low confidence score for license plate.');
  }

  let vehicleType = 'Car'; // Default vehicle type

  // Check if vehicle data exists and has a score
  const vehicleData1 = plateData1.results[0].vehicle;
  if (vehicleData1 && vehicleData1.score && vehicleData1.score >= 0.3) {
    vehicleType = vehicleData1.type;
    if (vehicleType === 'SUV') {
      vehicleType = 'Car';
    }
  } else {
    console.log('Vehicle data missing or low confidence, using default vehicle type: Car');
  }

  // Calculate the parking fee
  const { fee, duration, hours } = await calculateParkingFee(vehicleType, timestamp1, timestamp2);

  // Save the data to the database
  await saveData(fee, duration, hours, vehicleType, timestamp1, timestamp2);

  return { fee, duration, hours, plateData1, plateData2 };
}

module.exports = {
  savePlateData
};