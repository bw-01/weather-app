import "./styles.css";

let loc = "wellington";
const weatherAll = [];

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

async function getWeatherData(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=us&elements=datetime%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Cprecipprob%2Cconditions%2Cdescription%2Cicon&include=days%2Cfcst&key=XR9HGK7NHMV8HBK9BCTNUXUR8&contentType=json`;
  const response = await fetch(url, { mode: "cors" });
  const weatherData = await response.json();
  
  //console.log(weatherData);
  return weatherData;
}

function processData(data) {
    data.forEach(element => {
        const weather = new Weather(element);
        weatherAll.push(weather);
    });
}

getWeatherData(loc).then((data) => {
  processData(data.days);
});

console.log(weatherAll);