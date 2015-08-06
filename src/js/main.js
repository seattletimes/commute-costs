// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var data = require("./censusData.geo.json");
var ich = require("icanhaz");

var popupTemplate = require("./_popupTemplate.html");
ich.addTemplate("popupTemplate", popupTemplate);

var mapElement = document.querySelector("leaflet-map");
var L = mapElement.leaflet;
var map = mapElement.map;

var onEachFeature = function(feature, layer) {
  var up = true;
  var change = feature.properties.jobschange;
  if (change < 0) { 
    change = change * -1;
    up = false;
  }
  change = (change * 100).toFixed(2);
  layer.bindPopup(ich.popupTemplate({
    change: change,
    up: up
  }));
};

function getColor(d) {
  return d > 0.1 ? '#006837' :
         d > 0.06 ? '#1a9850' :
         d > 0.03 ? '#66bd63' :
         d > 0.01 ? '#a6d96a' :
         d > 0 ?    '#d9ef8b' :
         d > -.01 ? '#fee08b' :
         d > -.03 ? '#fdae61' :
         d > -.06 ? '#f46d43' :
         d > -.1 ? '#d73027' :
                    '#a50026' ;
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.jobschange),
    weight: 0.5,
    opacity: 1,
    color: 'white',
    fillOpacity: 1
  };
}

L.geoJson(data, {style: style, onEachFeature:onEachFeature}).addTo(map);