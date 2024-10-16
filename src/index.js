import "./styles.css";

let loc = "wellington";
const weatherAll = [];

// Stores daily weather data
class Weather {
  constructor(data) {
    this.date = data.datetime;
    this.currentTemp = data.temp;
    this.maxTemp = data.tempmax;
    this.minTemp = data.tempmin;
    this.feelsTemp = data.feelslike;
    this.precipitation = data.precipprob;
    this.conditions = data.icon;
    this.description = data.description;
  }
}

// Load the weather data from visualcrossing.com 
async function fetchWeatherData(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next6days?unitGroup=us&elements=datetime%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Cprecipprob%2Cconditions%2Cdescription%2Cicon&include=days%2Cfcst&key=XR9HGK7NHMV8HBK9BCTNUXUR8&contentType=json`;
  const response = await fetch(url, { mode: "cors" });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const weatherData = await response.json();
  return weatherData;
}

// Process any loaded data into Weather class objects
function processData(data) {
  data.forEach((element) => {
    const weather = new Weather(element);
    weatherAll.push(weather);
  });
}

// Main
fetchWeatherData(loc)
  .then((data) => {
    if (data && data.days) {
      processData(data.days);
    } else {
      console.log("No valid data available to process.");
    }
  })
  .catch((error) => {
    console.error("Error fetching weather data:", error);
  });

console.log(weatherAll);
