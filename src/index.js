import "./styles.css";

let defaultLocation = "wellington";
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
async function processData(location) {
  try {
    const data = await fetchWeatherData(location);
    if (data && data.days) {
      weatherAll.length = 0;

      data.days.forEach((element) => {
        const weather = new Weather(element);
        weatherAll.push(weather);
      });

      console.log("Data processed for:", location);
      console.log(weatherAll);
    } else {
      console.log("No valid data available");
    }
  } catch (error) {
    console.error("Error handling weather data:", error);
  }
}

processData(defaultLocation);

// Main
const locationForm = document.querySelector(".location-form");
locationForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const location = document.getElementById("location-input").value;
  processData(location);
});
