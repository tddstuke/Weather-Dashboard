var FormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name");
var containerDiv = document.querySelector("#container");
var iconUrl = "http://openweathermap.org/img/wn/";
var weatherDiv = document.querySelector("#weather-div");
var historyBtn = document.querySelector(".btn-secondary");
var searchedCities = [];

// var weatherDiv;

// get name of city from input
var getCityName = function (event) {
  event.preventDefault();
  var cityName = cityInputEl.value;

  if (cityName === "") {
    alert("Please Enter A Valid City Name");
    return;
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
        if (data.length === 0) {
          cityInputEl.value = "";
          alert("No Data Available. Please Try Again");
          return;
        }
        console.log(data);
        var city = data[0];
        var lat = city.lat;
        var lon = city.lon;
        console.log(lat, lon);
        getWeather(lat, lon);

        searchedCities.push(cityName);

        saveCity("cities", searchedCities);

        historyCity(cityName);
      });
    }
  });
};

// create button in search history
var historyCity = function (cityName) {
  if (cityName === "") {
    return;
  }

  var cityBtn = document.createElement("button");
  cityBtn.textContent = cityName.toUpperCase();
  cityBtn.classList = "btn btn-secondary col-12 mt-3 p-0";
  cityBtn.setAttribute("id", cityName);
  FormEl.appendChild(cityBtn);
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
  cityInputEl.value = "";

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
  weatherDiv.innerHTML = "";

  weatherDiv.append(
    cityHeader,
    currentTemp,
    currentWind,
    currentHumid,
    currentUV
  );
  weatherDiv.classList.add("border", "border-dark");
};

// save searches to page and local storage
var saveCity = function (cities, searchedCities) {
  localStorage.setItem("cities", searchedCities);
};

// load past searches from localstorage
var loadCity = function () {
  var cityName = localStorage.getItem("cities", searchedCities);
  if (!cityName) {
    console.log("nope");
    return;
  }
  cityName.trim();
  var cities = cityName.split(",");
  console.log(cities);
  cities.forEach(function (city) {
    if (!city) {
      return;
    }
    historyCity(city);
  });
};

var getBtnId = function (event) {
  console.log("click");
};

loadCity();

FormEl.addEventListener("submit", getCityName);
// document.addEventListener("click", function (e) {
//   if (e.target && e.target.classList == "btn-secondary") {
//     console.log("click");
//   }
// });
