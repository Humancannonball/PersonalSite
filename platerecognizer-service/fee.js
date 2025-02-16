const config = require('./config.json');
async function calculateParkingFee(vehicleType, entryTime, exitTime) {
  // Convert the entry and exit times to Date objects
  const entryDate = new Date(entryTime);
  const exitDate = new Date(exitTime);
  //calculate the duration of the parking in days, save the hours which do not add up to day in a variable
  const duration = Math.ceil((exitDate - entryDate) / (1000 * 60 * 60 * 24)); //for demonstration purposes days are rounded up

  let hours = Math.ceil((exitDate - entryDate) / (1000 * 60 * 60)) - duration * 24; //for demonstation purposes hours are rounded up
  // Ensure that hours is always positive
  if (hours < 0) {
    hours += 24;
  }
  //calculate the fee for the parking for each day
  let fee = 0;
  for (let i = 0; i < duration; i++) {
    let rate;
    const date = new Date(entryDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 5) {
      rate = config[vehicleType].friday.rate;
      fee += rate * 12;
    } else if (dayOfWeek === 6) {
      rate = config[vehicleType].saturday.rate;
      fee += rate * 24;
    } else if (dayOfWeek === 0) {
      rate = 0;
    } else {
      rate = config[vehicleType].weekday.rate;
      fee += rate * 9;
    }
  }
  //calculate the fee for the parking for the hours which do not add up to a day
  let rate;
  const date = new Date(entryDate.getTime() + duration * 24 * 60 * 60 * 1000);
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 5) {
    if (hours <= 12) {
      rate = config[vehicleType].friday.rate;
      fee += rate * hours;
    } else {
      rate = config[vehicleType].friday.rate;
      fee += rate * 12;
    }
  } else if (dayOfWeek === 6) {
    rate = config[vehicleType].saturday.rate;
    fee += rate * hours;
  } else if (dayOfWeek === 0) {
    rate = 0;
  } else {
    if (hours <= 9) {
      rate = config[vehicleType].weekday.rate;
      fee += rate * hours;
    } else {
      rate = config[vehicleType].weekday.rate;
      fee += rate * 9;
    }
  }
  return { fee, duration, hours };
}

module.exports = {
  calculateParkingFee
};
