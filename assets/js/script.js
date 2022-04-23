var FormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name");
var containerDiv = document.querySelector("#container");
var iconUrl = "http://openweathermap.org/img/wn/";

// get name of city from input
var getCityName = function (event) {
  event.preventDefault();
  var cityName = cityInputEl.value;
  console.log(cityName);

  if (!cityName) {
    alert("Please Enter A Valid City Name");
  }

  getCoordinates(cityName);
};

// convert city name to coordinates
var getCoordinates = function (cityName) {
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=7e2f2ef59beaeb2845cc363aaa76489b";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        var city = data[0];
        var lat = city.lat;
        var lon = city.lon;
        console.log(lat, lon);
        getWeather(lat, lon);
      });
    }
  });
};

// fetch city weather using weather api
var getWeather = function (lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly&units=imperial&appid=7e2f2ef59beaeb2845cc363aaa76489b";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        var weather = data;
        var nowWeather = weather.current;

        displayCurrent(nowWeather);
      });
    }
  });
};
// display weather data on page
var displayCurrent = function (weather) {
  console.log(weather);
  // create data elements for display
  var cityHeader = document.createElement("h2");
  cityHeader.textContent =
    cityInputEl.value.toUpperCase() + " " + dayjs().format("(MM/DD/YYYY)");

  var currentTemp = document.createElement("h4");
  currentTemp.textContent = "Temp: " + weather.temp + "°F";

  var currentWind = document.createElement("h4");
  currentWind.textContent = "Wind: " + weather.wind_speed + " MPH";
  console.log(currentWind);

  var currentHumid = document.createElement("h4");
  currentHumid.textContent = "Humidity: " + weather.humidity + "%";
  console.log(currentHumid);

  var currentUV = document.createElement("h4");
  currentUV.textContent = "UV Index: " + weather.uvi;
  console.log(currentUV);

  var iconEl = weather.weather[0].icon;
  console.log(weather.weather[0].icon);

  // append to div
  var weatherDiv = document.createElement("div");
  weatherDiv.classList = "col-7 border border-dark m-4";

  containerDiv.appendChild(weatherDiv);

  weatherDiv.append(
    cityHeader,
    currentTemp,
    currentWind,
    currentHumid,
    currentUV
  );
};
// save searches to page and local storage

FormEl.addEventListener("submit", getCityName);
