const api_key = "710a3dd3ac195eca9fbdbe4ca6bb0421";
const searchButton = document.querySelector("#searchButton");
const cardDiv = document.querySelector("#card");
const errorContainer = document.querySelector("#error");
const loader = document.createElement("div");
loader.classList.add("lds-dual-ring");

seeder();

function seeder(cityName = "London") {
  const getCityGeocode = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${api_key}`);

  cardDiv.appendChild(loader);

  getCityGeocode
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 404) {
        throw new Error("Can't find such city");
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((result) => {
      let isSwitched;

      let city = normalizeCityData(result);

      cardDiv.innerHTML = "";
      errorContainer.innerHTML = "";

      if (!cardDiv.hasChildNodes()) {
        createCardDOM();
      }

      render(city);

      const convertToCelciusButton = document.querySelector("#celciusButton");
      const convertToFahrenheitButton = document.querySelector("#fahrenheitButton");
      const temperatureValue = document.querySelector("#temperatureValue");
      const feelsLikeValue = document.querySelector("#feelsLikeValue");

      convertToCelciusButton.addEventListener("click", () => {
        if (isSwitched) {
          temperatureValue.innerText = `${city.temp.c}°`;
          feelsLikeValue.innerText = `Feels like: ${city.feelsLike.c}°`;

          convertToCelciusButton.classList.add("buttonActive");
          convertToFahrenheitButton.classList.remove("buttonActive");

          isSwitched = false;
        }
      });

      convertToFahrenheitButton.addEventListener("click", () => {
        if (!isSwitched) {
          convertToCelciusButton.classList.remove("buttonActive");
          convertToFahrenheitButton.classList.add("buttonActive");

          temperatureValue.innerText = `${city.temp.f}°`;
          feelsLikeValue.innerText = `Feels like: ${city.feelsLike.f}°`;

          isSwitched = true;
        }
      });
    })
    .catch((error) => {
      if (error == "Error: Can't find such city") {
        errorContainer.innerText = `${error}`;
      } else {
        cardDiv.innerHTML = "";
        cardDiv.innerText = `${error}`;
      }
    });
}

searchButton.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  cardDiv.innerHTML = "";
  seeder(city);
});

function render(normalizedCity) {
  const headerCityInfo = document.querySelector("#headerCityInfo");
  const headerTimeStamp = document.querySelector("#headerTimeStamp");
  const mainLeftSideFooterText = document.querySelector("#mainLeftSideFooterText");
  const temperatureValue = document.querySelector("#temperatureValue");
  const weatherIconImage = document.querySelector("#weatherIconImage");
  const feelsLikeValue = document.querySelector("#feelsLikeValue");
  const feelsLikeSvgImg = document.querySelector("#feelsLikeSvgImg");
  const windSpeedValue = document.querySelector("#windSpeedValue");
  const windSpeedSvgImg = document.querySelector("#windSpeedSvgImg");
  const humidityValue = document.querySelector("#humidityValue");
  const humiditySvgImg = document.querySelector("#humiditySvgImg");
  const celciusButton = document.querySelector("#celciusButton");
  celciusButton.classList.add("buttonActive");

  headerCityInfo.innerText = `${normalizedCity.name}, ${normalizedCity.country}`;
  headerTimeStamp.innerText = `As of ${normalizedCity.time}`;
  mainLeftSideFooterText.innerText = normalizedCity.description;
  temperatureValue.innerText = `${normalizedCity.temp.c}°`;
  weatherIconImage.setAttribute("src", weatherIconByDescription[normalizedCity.description]);
  feelsLikeValue.innerText = `Feels like: ${normalizedCity.feelsLike.c}°`;
  feelsLikeSvgImg.setAttribute("src", weatherInfoIcons.feelsLike);
  windSpeedValue.innerText = `Wind: ${normalizedCity.windSpeed} ms`;
  windSpeedSvgImg.setAttribute("src", weatherInfoIcons.windSpeed);
  humidityValue.innerText = `Humidity: ${normalizedCity.humidity}%`;
  humiditySvgImg.setAttribute("src", weatherInfoIcons.humidity);
}

function createCardDOM() {
  const header = createCustomElement("div", "header", cardDiv);
  const main = createCustomElement("div", "main", cardDiv);

  const headerInfo = createCustomElement("div", "headerInfo", header);
  const headerConverter = createCustomElement("div", "headerConverter", header);
  const headerCityInfo = createCustomElement("div", "headerCityInfo", headerInfo);
  const headerTimeStamp = createCustomElement("div", "headerTimeStamp", headerInfo);

  const celciusButton = createCustomElement("button", "celciusButton", headerConverter, "converter", "°C");
  const fahrenheitButton = createCustomElement("button", "fahrenheitButton", headerConverter, "converter", "°F");

  const mainLeftSide = createCustomElement("div", "mainLeftSide", main);
  const mainRightSide = createCustomElement("div", "mainRightSide", main);
  const mainLeftSideMain = createCustomElement("div", "mainLeftSideMain", mainLeftSide);
  const mainLeftSideFooter = createCustomElement("div", "mainLeftSideFooter", mainLeftSide);
  const mainLeftSideFooterText = createCustomElement("div", "mainLeftSideFooterText", mainLeftSideFooter);

  const temperatureValueDiv = createCustomElement("div", "temperatureValueDiv", mainLeftSideMain);
  const temperatureValue = createCustomElement("div", "temperatureValue", temperatureValueDiv);

  const weatherIconDiv = createCustomElement("div", "weatherIconDiv", mainLeftSideMain);
  const weatherIconImage = createCustomElement("img", "weatherIconImage", weatherIconDiv);

  const humidityDiv = createCustomElement("div", "humidityDiv", mainRightSide, "rightSideContainer");
  const humiditySvgDiv = createCustomElement("div", "humiditySvgDiv", humidityDiv, "rightSideSvgDiv");
  const humiditySvgImg = createCustomElement("img", "humiditySvgImg", humiditySvgDiv, "rightSideImg");
  const humidityValue = createCustomElement("div", "humidityValue", humidityDiv, "rightSideValue");

  const feelsLikeDiv = createCustomElement("div", "feelsLikeDiv", mainRightSide, "rightSideContainer");
  const feelsLikeSvgDiv = createCustomElement("div", "feelsLikeSvgDiv", feelsLikeDiv, "rightSideSvgDiv");
  const feelsLikeSvgImg = createCustomElement("img", "feelsLikeSvgImg", feelsLikeSvgDiv, "rightSideImg");
  const feelsLikeValue = createCustomElement("div", "feelsLikeValue", feelsLikeDiv, "rightSideValue");

  const windSpeedDiv = createCustomElement("div", "windSpeedDiv", mainRightSide, "rightSideContainer");
  const windSpeedSvgDiv = createCustomElement("div", "windSpeedSvgDiv", windSpeedDiv, "rightSideSvgDiv");
  const windSpeedSvgImg = createCustomElement("img", "windSpeedSvgImg", windSpeedSvgDiv, "rightSideImg");
  const windSpeedValue = createCustomElement("div", "windSpeedValue", windSpeedDiv, "rightSideValue");
}

function normalizeCityData(city) {
  const tempCelcius = convertKelvinToCelcius(city.main.temp);
  const tempFahrenheit = convertCelciusToFahrenheit(tempCelcius);
  const currentTime = getCurrentTime(city.dt);
  const feelslikeTempC = convertKelvinToCelcius(city.main.feels_like);
  const feelslikeTempF = convertCelciusToFahrenheit(feelslikeTempC);
  let weatherDescription = city.weather[0].description.split("");
  weatherDescription = weatherDescription[0].toUpperCase() + weatherDescription.slice(1).join("");

  return {
    name: city.name,
    country: city.sys.country,
    windSpeed: city.wind.speed,
    humidity: city.main.humidity,
    description: weatherDescription,
    time: currentTime,
    temp: {
      c: tempCelcius,
      f: tempFahrenheit,
    },
    feelsLike: {
      c: feelslikeTempC,
      f: feelslikeTempF,
    },
  };
}

function convertKelvinToCelcius(temperature) {
  return Math.round(temperature - 273.15);
}

function convertCelciusToFahrenheit(temperature) {
  return Math.round(temperature * (9 / 5) + 32);
}

function createCustomElement(element, id, parent, newClass, text) {
  let elem = document.createElement(element);
  elem.setAttribute("id", id);

  if (parent) parent.appendChild(elem);
  if (text) elem.innerText = text;
  if (newClass) elem.classList.add(newClass);

  return elem;
}

function getCurrentTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return pad(hours) + ":" + pad(minutes);
}

const pad = (num) => ("0" + num).slice(-2);

const weatherIconByDescription = {
  "Scattered clouds": "icons/scatteredClous.svg",
  "Clear sky": "icons/clearsky.svg",
  "Few clouds": "icons/clouds.svg",
  "Overcast clouds": "icons/overcastClouds.svg",
  "Light rain": "icons/rain.svg",
  Drizzle: "icons/drizzle.svg",
  Rain: "icons/rain.svg",
  "Shower rain": "icons/showerRain.svg",
  Thunderstorm: "icons/thunderStorm.svg",
  Snow: "icons/snow.svg",
  Mist: "icons/mist.svg",
  "Broken clouds": "icons/overcastClouds.svg",
  "Heavy intensity rain": "icons/drizzle.svg",
  "Moderate rain": "icons/rain.svg",
};

const weatherInfoIcons = {
  feelsLike: "icons/temperature.svg",
  windSpeed: "icons/wind.svg",
  humidity: "icons/humidity.svg",
};
