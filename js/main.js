"use strict";

var gStartTime = Date.now();
var gInterval;

console.log("Main!");
import locService from "./services/loc.service.js";
import mapService from "./services/map.service.js";
import weatherService from "./services/weather.service.js";
document.querySelector(".btn1").addEventListener("click", ev => {
  onMyPosition();
});
document.querySelector(".btn2").addEventListener("click", ev => {
  onAddressLookup();
});
document.querySelector(".btn3").addEventListener("click", ev => {
  onWeather();
});

window.onload = () => {
  console.log("Window.onload");
  mapService
    .initMap()
    .then(() => {})
    .catch(console.warn);
};

function onWeather() {
  weatherService.getWeather();
}

function onMyPosition() {
  locService
    .getPosition()
    .then(pos => {
      console.log("getPosition returned:", pos);
      var posObj = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      moveToCenter(posObj.lat, posObj.lng);
      mapService.addMarker(posObj);
      mapService.drawAccuracyCircle(posObj, pos.coords.accuracy);
      mapService.getAddress(posObj.lat, posObj.lng).then(res => {
        document.querySelector(".address").innerText = res.formatted_address;
      });
    })
    .catch(err => {
      console.log("getPosition() error!!!", err);
    });
}

function onAddressLookup(ev) {
  var searchQuery = document.querySelector(".input-container input").value;
  var coord = locService.getLocs(searchQuery);
  coord.then(res => {
    var posObj = res.geometry.location;
    var name1 = res.address_components[0].long_name;
    var name2 = res.address_components[1].long_name;
    var name3 = res.address_components[2].long_name;
    var name4 = res.address_components[3].long_name;
    moveToCenter(posObj.lat, posObj.lng);
    document.querySelector(
      ".address"
    ).innerText = `${name1} , ${name2} , ${name3} , ${name4}`;
  });
}

function moveToCenter(lat, lng) {
  var posObj = {
    lat: lat,
    lng: lng
  };
  mapService.addMarker(posObj);
  var elMap = mapService.getElMap();
  elMap.panTo({ lat: lat, lng: lng });
  document.querySelector(".coord").innerText = `${lat.toFixed(4)} ,
   ${lng.toFixed(4)}`;

   var weather = weatherService.getWeather(lat,lng)
   weather.then(function(data){
       console.log('********* MAIN got weather:',data);
       console.log("Weather Now:", data.weather[0].description);
       console.log("Temp [C] =", (data.main.temp).toFixed(1));
       console.log("Humidity [%] =", data.main.humidity);
       console.log("Wind Speed [Km/h] =", (data.wind.speed * 3.6).toFixed());
       console.log("Wind Direction [Azimut] =", (data.wind.deg).toFixed(0));
   })

  // driveMap(lat, lng);
}

function driveMap(lat, lng) {
  clearInterval(gInterval);
  gStartTime = Date.now();
  gInterval = setInterval(function() {
    var delta = (Date.now() - gStartTime) / 500000;
    var elMap = mapService.getElMap();
    elMap.panTo({ lat: lat + delta, lng: lng + delta / 3 });
  }, 40);
}
