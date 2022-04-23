var FormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name");

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
        var nowWeather = data;
        console.log(nowWeather.current.temp);
        console.log(nowWeather.current.wind_speed);
        console.log(nowWeather.current.humidity);
        console.log(nowWeather.current.uvi);
        console.log(nowWeather.current.weather[0].main);
      });
    }
  });
};
// display weather data on page
// save searches to page and local storage

FormEl.addEventListener("submit", getCityName);
