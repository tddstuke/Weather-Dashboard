var FormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name");
var containerDiv = document.querySelector("#container");
var iconUrl = "http://openweathermap.org/img/wn/";
var weatherDiv = document.querySelector("#weather-div");
var historyBtn = document.querySelector(".btn-secondary");
var searchedCities = [];

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
        var cityName = city.name;
        console.log(cityName);
        var lat = city.lat;
        var lon = city.lon;
        console.log(lat, lon);

        getWeather(lat, lon);

        console.log(searchedCities);

        if (searchedCities.includes(cityName)) {
          return;
        }

        searchedCities.push(cityName);

        historyCity(cityName);

        saveCity("cities", searchedCities);
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
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          var weather = data;
          var nowWeather = weather.current;
          var laterWeather = weather.daily;
          console.log(laterWeather);

          displayCurrent(nowWeather);
          displayLater(laterWeather);
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

// display weather data on page
var displayCurrent = function (weather) {
  console.log(weather);
  var iconEl = weather.weather[0].icon;
  console.log(weather.weather[0].icon);
  // create data elements for display
  var iconImg = document.createElement("img");
  iconImg.src = iconUrl + iconEl + ".png";
  // console.log(iconImg.src);

  var cityHeader = document.createElement("h2");
  cityHeader.textContent =
    cityInputEl.value.toUpperCase() + " " + dayjs().format("(MM/DD/YYYY)");
  cityInputEl.value = "";

  cityHeader.appendChild(iconImg);

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

  // append to div
  weatherDiv.innerHTML = "";

  var currentDiv = document.createElement("div");
  weatherDiv.appendChild(currentDiv);

  currentDiv.append(
    cityHeader,
    currentTemp,
    currentWind,
    currentHumid,
    currentUV
  );
  currentDiv.classList.add("border", "border-dark", "p-2");
};

// display five day forecast
var displayLater = function (laterWeather) {
  var laterDiv = document.createElement("div");
  laterDiv.classList = "mt-2";
  weatherDiv.appendChild(laterDiv);

  var laterHeader = document.createElement("h3");
  laterHeader.textContent = "5-Day Forecast";
  laterDiv.appendChild(laterHeader);

  var cardDiv = document.createElement("div");
  cardDiv.classList = "row justify-content-around";
  laterDiv.appendChild(cardDiv);

  laterWeather.slice(1, 6).forEach(function (day, i) {
    var dayDiv = document.createElement("div");
    dayDiv.classList = "bg-secondary text-light p-2";

    var date = document.createElement("h5");
    date.textContent = dayjs()
      .add(i + 1, "day")
      .format("(MM/DD/YYYY)");

    var icon = day.weather[0].icon;
    var iconImg = document.createElement("img");
    iconImg.src = iconUrl + icon + ".png";

    var temp = document.createElement("h6");
    temp.textContent = "Temp: " + day.temp.day + "°F";

    var wind = document.createElement("h6");
    wind.textContent = "Wind: " + day.wind_speed + " MPH";

    var humidity = document.createElement("h6");
    humidity.textContent = "Humidity: " + day.humidity + "%";

    cardDiv.appendChild(dayDiv);
    dayDiv.append(date, iconImg, temp, wind, humidity);
  });
};

// save searches to page and local storage
var saveCity = function (cities, searchedCities) {
  localStorage.setItem("cities", JSON.stringify(searchedCities));
};

// load past searches from localstorage
var loadCity = function () {
  searchedCities = JSON.parse(localStorage.getItem("cities"));
  if (!searchedCities) {
    searchedCities = [];
    console.log("nope");
    return;
  }

  searchedCities.forEach(function (city) {
    if (!city) {
      return;
    }
    historyCity(city);
  });
};

loadCity();

FormEl.addEventListener("submit", getCityName);
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList == "btn btn-secondary col-12 mt-3 p-0") {
    var cityName = e.target.id;
    cityInputEl.value = cityName;
  }
});
