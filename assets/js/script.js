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

// fetch city weather using weather api
var getCoordinates = function (cityName) {
  // convert city name to coordinates
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=7e2f2ef59beaeb2845cc363aaa76489b";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data[0].lat);
      });
    }
  });
};

// display weather data on page
// save searches to page and local storage

FormEl.addEventListener("submit", getCityName);
