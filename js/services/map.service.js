"use strict";
var map;
const API_KEY = "AIzaSyD67lPXPg8EI4trZ76btJx69USptKrdjeE";

function initMap(lat = 32.088, lng = 34.8) {
  return _connectGoogleApi().then(() => {
    map = new google.maps.Map(document.querySelector("#map"), {
      center: { lat, lng },
      zoom: 17
    });
  });
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: map,
    title: ` Best Position in town: \n LAT ${loc.lat}  ,  LONG ${loc.lng}`
  });
  return marker;
}

function drawAccuracyCircle(loc,accu){
  if (accu > 250) accu = 250;
  var circle = new google.maps.Circle({
    strokeColor: '#FF8800',
    strokeOpacity: 0.6,
    strokeWeight: 3,
    fillColor: '#FF0022',
    fillOpacity: 0.18,
    map: map,
    center: loc,
    radius: accu
  });
  return circle
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  var elGoogleApi = document.createElement("script");
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);
  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject("Google script failed to load");
    // elGoogleApi.onerror = reject.bind(null,'Google script failed to load')
  });
}

function getElMap() {
  return map;
}

function getAddress(lat,lng){
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
    .then((res) => {
        return res.json()
        .then(function(data){
            console.log('data = ',data.results[0].formatted_address);
            return data.results[0];
        })
    })
}

export default {
  drawAccuracyCircle,
  getAddress,
  getElMap,
  initMap,
  addMarker
};
