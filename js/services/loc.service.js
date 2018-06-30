"use strict";
var locs = [{ lat: 11.22, lng: 22.11 }];
const API_KEY = "AIzaSyD67lPXPg8EI4trZ76btJx69USptKrdjeE";

// function getLocs1() {
//     return Promise.resolve(locs);
// }

function getLocs(searchQuery) {
  var prm = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${API_KEY}`
  );
  return prm.then(function(resolve) {
    return resolve.json().then(resolveJson => {
      return resolveJson.results[0];
    })
  })
}

// setTimeout(()=>{
// resolve(locs).then(console.log('***locs***',locs));
// },50)
// });

function getPosition() {
  console.log("Getting Pos");
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export default {
  getLocs: getLocs,
  getPosition: getPosition
};
