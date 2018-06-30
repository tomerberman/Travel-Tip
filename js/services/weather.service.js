"use strict";

const API_KEY = "db67d4f6a6b83524d842f2e3b6b5d09d";



function getWeather(lat, lng) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=db67d4f6a6b83524d842f2e3b6b5d09d`
  ).then(function(res) {
    console.log("weather-res before JSON=", res);
    return res.json()
      .then(function(data){
      console.log("weather-res after JSON=", data);
      console.log("weather-res after JSON=", data.main.humidity);
      console.log("weather-res after JSON=", data.main.temp);
      console.log("weather-res after JSON=", data.weather[0].description);
      console.log("weather-res after JSON=", data.wind.speed);
      console.log("weather-res after JSON=", data.wind.deg);
        return data;
      })
  })
  .catch(function(err){
      console.log('err weather=',err);
  })
}

export default {
    getWeather
}
