"use strict";

var gStartTime = Date.now();
var gInterval = null;
var gCurrPos;

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
  onAnimateMap();
});
document.querySelector(".copy-location").addEventListener("click", ev => {
  onCopyLocation();
});
document.querySelector(".weather-data").addEventListener("click", ev => {
  onWeatherModal();
});


window.onload = () => {
  console.log("Window.onload");
  mapService
    .initMap()
    .then(function(res){
        centerToUrl();
      })
    .catch(console.warn);
};


function centerToUrl() {
  var urlParams;
  var match,
    pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function(s) {
      return decodeURIComponent(s.replace(pl, " "));
    },
    query = window.location.search.substring(1);
  urlParams = {};
  while ((match = search.exec(query)))
    urlParams[decode(match[1])] = decode(match[2]);
  if (urlParams.lat && urlParams.lng)
    moveToCenter(+urlParams.lat, +urlParams.lng);
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
      gCurrPos = posObj;
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

function onCopyLocation() {
  var strUrl = "https://tomerberman.github.io/Travel-Tip/index.html";
  strUrl += '?' + document.querySelector(".coord").innerText;
  var textarea = document.createElement("textarea");
  textarea.style.position = "fixed";
  document.body.appendChild(textarea);
  textarea.textContent = strUrl;
  textarea.select();
  try {
    return document.execCommand("cut");
  } catch (ex) {
    console.warn("Copy to clipboard failed.", ex);
    return false;
  } finally {
    document.body.removeChild(textarea);
  }

  // var pasteText = document.querySelector("#output");
  // pasteText.focus();
  // document.execCommand("paste");
  // console.log(pasteText.textContent);
}

function onAddressLookup(ev) {
  var searchQuery = document.querySelector(".input-container input").value;

  var coord = locService.getLocs(searchQuery);
  coord.then(res => {
    var posObj = res.geometry.location;
    var strHtml = "";
    for (let i = 0; i < res.address_components.length; i++) {
      strHtml += res.address_components[i].long_name + " , ";
    }
    moveToCenter(posObj.lat, posObj.lng);
    document.querySelector(".address").innerText = strHtml;
  });
}

function moveToCenter(lat, lng) {
  var posObj = {
    lat: lat,
    lng: lng
  };
  gCurrPos = posObj;
  mapService.addMarker(posObj);
  var elMap = mapService.getElMap();
  elMap.panTo({ lat: lat, lng: lng });
  document.querySelector(".coord").innerText = `Lat  : ${lat.toFixed(4)} 
   Long: ${lng.toFixed(4)}`;

  var weather = weatherService.getWeather(lat, lng);
  weather.then(function(data) {
    var str = '';
    str += "<li>Current Conditions : " + data.weather[0].description + '</li>';
    str += "<li>Temp [C] : " + data.main.temp.toFixed(1) + '</li>';
    str += "<li>Humidity [%] : " + data.main.humidity + '</li>';
    str += "<li>Wind [Km/h] : " + (data.wind.speed * 3.6).toFixed() + '</li>';
    str += "<li>Wind [Azimut] : " + data.wind.deg.toFixed(0) + '</li>';
    document.querySelector('.weather-data ul').innerHTML = str;
    document.querySelector('.weather-data').classList.add('show');
    document.querySelector('.weather-data').classList.remove('hide');

    console.log("********* MAIN got weather:", data);
    console.log("Weather Now:", data.weather[0].description);
    console.log("Temp [C] =", data.main.temp.toFixed(1));
    console.log("Humidity [%] =", data.main.humidity);
    console.log("Wind Speed [Km/h] =", (data.wind.speed * 3.6).toFixed());
    console.log("Wind Direction [Azimut] =", data.wind.deg.toFixed(0));
  });
}

function onWeatherModal(){
  document.querySelector('.weather-data').classList.add('hide');
  document.querySelector('.weather-data').classList.remove('show');
}

function onAnimateMap(){
  animateMap(gCurrPos.lat, gCurrPos.lng);
}

function animateMap(lat, lng) {
  var elMap = mapService.getElMap();

  if (gInterval) {
    clearInterval(gInterval);
    gInterval = null;
    elMap.setMapTypeId('roadmap');
    return;
  }
  elMap.setMapTypeId('satellite');
  gStartTime = Date.now();
  gInterval = setInterval(function() {
    var delta = (Date.now() - gStartTime) / 500000;
    elMap.panTo({ lat: lat + delta, lng: lng + delta / 3 });
  }, 40);
}
