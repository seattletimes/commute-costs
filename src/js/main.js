// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var data = require("./censusData.geo.json");

var mapElement = document.querySelector("leaflet-map");
var L = mapElement.leaflet;
var map = mapElement.map;

function getColor(d) {
  return d > 0.1 ? '#006837' :
         d > 0.08 ? '#1a9850' :
         d > 0.05 ? '#66bd63' :
         d > 0.03 ? '#a6d96a' :
         d > 0 ?    '#d9ef8b' :
         d == "0%" ?   'black'   :
         d > -.03 ? '#fee08b' :
         d > -.05 ? '#fdae61' :
         d > -.08 ? '#f46d43' :
         d > -.1 ? '#d73027' :
                    '#a50026' ;
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.jobschange),
    weight: 0.5,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  };
}

L.geoJson(data, {style: style}).addTo(map);