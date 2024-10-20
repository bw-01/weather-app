import "./styles.css";

const defaultLocation = "London";
const weatherAll = [];
let useCelsius = true;

// Stores daily weather data
class Weather {
  static location = "";

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

  static setLocation(location) {
    Weather.location = location;
  }

  static getLocation() {
    return Weather.location;
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
      Weather.setLocation(data.resolvedAddress);

      data.days.forEach((element) => {
        const weather = new Weather(element);
        weatherAll.push(weather);
      });

      console.log("Data processed for:", location);
      console.log(weatherAll);
      updateWeather(weatherAll[0]);
    } else {
      console.log("No valid data available");
    }
  } catch (error) {
    console.error("Error handling weather data:", error);
  }
}

// Update the UI with weather data
function updateWeather(data) {
  const currentTemp = useCelsius
    ? convertToCelsius(data.currentTemp)
    : Math.round(data.currentTemp);
  const unitSymbol = useCelsius ? "C" : "F";
  document.getElementById(
    "current-temp"
  ).innerHTML = `${currentTemp}<span class="temp-unit">°${unitSymbol}</span>`;

  document.getElementById("current-location").textContent = Weather.getLocation();

  const minTemp = useCelsius ? convertToCelsius(data.minTemp) : Math.round(data.minTemp);
  const maxTemp = useCelsius ? convertToCelsius(data.maxTemp) : Math.round(data.maxTemp);
  document.getElementById("current-high-low").textContent = `${maxTemp}° / ${minTemp}°`;

  const feelsTemp = useCelsius ? convertToCelsius(data.feelsTemp) : Math.round(data.feelsTemp);
  document.getElementById("feels-like").textContent = `Feels like ${feelsTemp}°`;

  const now = new Date();
  const dayOfWeek = now.toLocaleString("en-US", { weekday: "short" });
  const dayOfMonth = now.getDate();
  const month = now.toLocaleString("en-US", { month: "short" });
  const time = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const currentDateTime = `${dayOfWeek}, ${dayOfMonth} ${month}, ${time}`;
  document.getElementById("current-date").textContent = currentDateTime;

  const iconElement = document.getElementById("current-icon");
  iconElement.innerHTML = getWeatherIcon(data.conditions);

  updateDaily(weatherAll);

  document.getElementById("summary-text").textContent = data.description;
}

// Update the row of daily forecasts
function updateDaily(weatherData) {
  weatherData.forEach((dayData, index) => {
    const dayDiv = document.getElementById(`day-${index + 1}`);

    if (dayDiv) {
      const dayNameElement = dayDiv.querySelector(".day-name");
      const date = new Date(dayData.date);
      const dayName = date.toLocaleString("en-US", { weekday: "short" });
      dayNameElement.textContent = dayName;

      const dayTemp = useCelsius
        ? convertToCelsius(dayData.currentTemp)
        : Math.round(dayData.currentTemp);
      const dayTempElement = dayDiv.querySelector(".day-temp");
      dayTempElement.textContent = `${dayTemp}°`;

      const rainChanceElement = dayDiv.querySelector(".rain-chance");
      rainChanceElement.textContent = `${Math.round(dayData.precipitation)}%`;

      const iconElement = dayDiv.querySelector(".day-icon");
      iconElement.innerHTML = getWeatherIcon(dayData.conditions);
    }
  });
}

// Get the SVG image based on the weather condition
function getWeatherIcon(condition) {
  switch (condition.toLowerCase()) {
    case "snow":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-snowy-heavy</title>
      <path fill="#00BFFF" d="M4,16.36C3.86,15.82 4.18,15.25 4.73,15.11L7,14.5L5.33,12.86C4.93,12.46 4.93,11.81 5.33,11.4C5.73,11 6.4,11 6.79,11.4L8.45,13.05L9.04,10.8C9.18,10.24 9.75,9.92 10.29,10.07C10.85,10.21 11.17,10.78 11,11.33L10.42,13.58L12.67,13C13.22,12.83 13.79,13.15 13.93,13.71C14.08,14.25 13.76,14.82 13.2,14.96L10.95,15.55L12.6,17.21C13,17.6 13,18.27 12.6,18.67C12.2,19.07 11.54,19.07 11.15,18.67L9.5,17L8.89,19.27C8.75,19.83 8.18,20.14 7.64,20C7.08,19.86 6.77,19.29 6.91,18.74L7.5,16.5L5.26,17.09C4.71,17.23 4.14,16.92 4,16.36M1,10A5,5 0 0,1 6,5C7,2.65 9.3,1 12,1C15.43,1 18.24,3.66 18.5,7.03L19,7A4,4 0 0,1 23,11A4,4 0 0,1 19,15A1,1 0 0,1 18,14A1,1 0 0,1 19,13A2,2 0 0,0 21,11A2,2 0 0,0 19,9H17V8A5,5 0 0,0 12,3C9.5,3 7.45,4.82 7.06,7.19C6.73,7.07 6.37,7 6,7A3,3 0 0,0 3,10C3,10.85 3.35,11.61 3.91,12.16C4.27,12.55 4.26,13.16 3.88,13.54C3.5,13.93 2.85,13.93 2.47,13.54C1.56,12.63 1,11.38 1,10M14.03,20.43C14.13,20.82 14.5,21.04 14.91,20.94L16.5,20.5L16.06,22.09C15.96,22.5 16.18,22.87 16.57,22.97C16.95,23.08 17.35,22.85 17.45,22.46L17.86,20.89L19.03,22.05C19.3,22.33 19.77,22.33 20.05,22.05C20.33,21.77 20.33,21.3 20.05,21.03L18.89,19.86L20.46,19.45C20.85,19.35 21.08,18.95 20.97,18.57C20.87,18.18 20.5,17.96 20.09,18.06L18.5,18.5L18.94,16.91C19.04,16.5 18.82,16.13 18.43,16.03C18.05,15.92 17.65,16.15 17.55,16.54L17.14,18.11L15.97,16.95C15.7,16.67 15.23,16.67 14.95,16.95C14.67,17.24 14.67,17.7 14.95,17.97L16.11,19.14L14.54,19.55C14.15,19.65 13.92,20.05 14.03,20.43Z" /></svg>`;

    case "rain":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-rainy</title>
      <path fill="#7E7F80" d="M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59" /></svg>`;

    case "fog":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-fog</title><path fill="#A9A9A9" d="M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z" /></svg>`;

    case "wind":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-windy</title>
      <path fill="#4597E6" d="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z" /></svg>`;

    case "cloudy":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-cloudy</title>
      <path fill="#D2D4D6" d="M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z" /></svg>`;

    case "partly-cloudy-day":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M15.92 11.46C17.19 12.56 18 14.19 18 16V16.17C18.31 16.06 18.65 16 19 16C19.7956 16 20.5587 16.3161 21.1213 16.8787C21.6839 17.4413 22 18.2044 22 19C22 19.7956 21.6839 20.5587 21.1213 21.1213C20.5587 21.6839 19.7956 22 19 22H6C4.93913 22 3.92172 21.5786 3.17157 20.8284C2.42143 20.0783 2 19.0609 2 18C2 16.9391 2.42143 15.9217 3.17157 15.1716C3.92172 14.4214 4.93913 14 6 14H6.27C8.56 8.82 13.6571 9.5 15.92 11.46ZM19 18H16V16C16 14.9391 15.5786 13.9217 14.8284 13.1716C14.0783 12.4214 13.0609 12 12 12C10.9391 12 9.92172 12.4214 9.17157 13.1716C8.42143 13.9217 8 14.9391 8 16H6C5.46957 16 4.96086 16.2107 4.58579 16.5858C4.21071 16.9609 4 17.4696 4 18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H19C19.2652 20 19.5196 19.8946 19.7071 19.7071C19.8946 19.5196 20 19.2652 20 19C20 18.7348 19.8946 18.4804 19.7071 18.2929C19.5196 18.1054 19.2652 18 19 18Z" fill="#D8DFE6"/>
        <path d="M15.86 11.64C16.29 9.21 15.04 6.68 12.68 5.65C9.91 4.42 6.66 5.68 5.44 8.44C4.54 10.42 4.94 12.63 6.21 14.18C6.53728 13.4397 6.91992 12.8154 7.34229 12.2953C6.86916 11.3879 6.79247 10.2645 7.25 9.25C8.03 7.49 10.1 6.68 11.87 7.48C13.1118 8.03634 13.87 9.22433 13.9387 10.4949C14.6714 10.7643 15.3318 11.1611 15.86 11.64Z" fill="#FFD700"/>
        <path d="M11.82 3.3C12.39 3.41 12.94 3.58 13.49 3.82C14.13 4.11 14.7 4.47 15.21 4.89L14.31 2L11.82 3.3Z" fill="#FFD700"/>
        <path d="M4.74 5.81C5.11 5.37 5.54 4.97 6.03 4.62C6.59 4.21 7.19 3.89 7.81 3.68L4.85 3L4.74 5.81Z" fill="#FFD700"/>
        <path d="M17.53 8.18C17.72 8.73 17.85 9.3 17.94 9.89C17.99 10.58 17.97 11.26 17.86 11.91L19.91 9.68L17.53 8.18Z" fill="#FFD700"/>
        <path d="M3.37 13.18C3.18 12.65 3.05 12.08 2.98 11.48C2.91 10.79 2.94 10.11 3.04 9.46L1 11.68L3.37 13.18Z" fill="#FFD700"/>
        </svg>`;

    case "partly-cloudy-night":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-night-partly-cloudy</title><path fill="#778899" d="M22,10.28C21.74,10.3 21.5,10.31 21.26,10.31C19.32,10.31 17.39,9.57 15.91,8.09C14.25,6.44 13.5,4.19 13.72,2C13.77,1.53 13.22,1 12.71,1C12.57,1 12.44,1.04 12.32,1.12C12,1.36 11.66,1.64 11.36,1.94C9.05,4.24 8.55,7.66 9.84,10.46C8.31,11.11 7.13,12.43 6.69,14.06L6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22H19A3,3 0 0,0 22,19A3,3 0 0,0 19,16C18.42,16 17.88,16.16 17.42,16.45L17.5,15.5C17.5,15.28 17.5,15.05 17.46,14.83C19.14,14.67 20.77,13.94 22.06,12.64C22.38,12.34 22.64,12 22.88,11.68C23.27,11.13 22.65,10.28 22.04,10.28M19,18A1,1 0 0,1 20,19A1,1 0 0,1 19,20H6A2,2 0 0,1 4,18A2,2 0 0,1 6,16H8.5V15.5C8.5,13.94 9.53,12.64 10.94,12.18C11.1,12.13 11.26,12.09 11.43,12.06C11.61,12.03 11.8,12 12,12C12.23,12 12.45,12.03 12.66,12.07C12.73,12.08 12.8,12.1 12.87,12.13C13,12.16 13.15,12.2 13.28,12.25C13.36,12.28 13.44,12.32 13.5,12.36C13.63,12.41 13.74,12.47 13.84,12.54C13.92,12.59 14,12.64 14.07,12.7C14.17,12.77 14.25,12.84 14.34,12.92C14.41,13 14.5,13.05 14.55,13.12C14.63,13.2 14.69,13.29 14.76,13.37C14.82,13.45 14.89,13.53 14.94,13.62C15,13.71 15.04,13.8 15.09,13.9C15.14,14 15.2,14.08 15.24,14.18C15.41,14.59 15.5,15.03 15.5,15.5V18M16.83,12.86C15.9,11.16 14.08,10 12,10H11.87C11.41,9.19 11.14,8.26 11.14,7.29C11.14,6.31 11.39,5.37 11.86,4.55C12.21,6.41 13.12,8.14 14.5,9.5C15.86,10.88 17.58,11.79 19.45,12.14C18.66,12.6 17.76,12.84 16.83,12.86Z" /></svg>`;

    case "clear-day":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-sunny</title>
      <path fill="#FFD700" d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" /></svg>`;

    case "clear-night":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-night</title><path fill="#191970" d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" /></svg>`;

    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-sunny-alert</title><path d="M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56M19,13V7H21V13H19M19,17V15H21V17" /></svg>`;
  }
}

// Convert temps from fahrenheit to celsius
function convertToCelsius(temp) {
  return Math.round((temp - 32) * (5 / 9));
}

// Main
processData(defaultLocation); // Get data for default location

const locationForm = document.querySelector(".location-form");
const locationInput = document.getElementById("location-input");

locationForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const location = locationInput.value;
  processData(location);
});

// Capitalise first letters of input
locationInput.addEventListener("input", function () {
  locationInput.value = locationInput.value.replace(/\b\w/g, (char) => char.toUpperCase());
});

// Toggle to/from celsius
const fcToggle = document.getElementById("fc-toggle");

fcToggle.addEventListener("change", function () {
  useCelsius = !useCelsius;
  updateWeather(weatherAll[0]);
});
