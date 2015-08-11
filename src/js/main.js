// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var data = require("./censusJobData.geo.json");
var ich = require("icanhaz");

var popupTemplate = require("./_popupTemplate.html");
ich.addTemplate("popupTemplate", popupTemplate);

var mapElement = document.querySelector("leaflet-map");
var L = mapElement.leaflet;
var map = mapElement.map;

map.scrollWheelZoom.disable();

var focused = false;

function commafy( num ) {
  var str = num.toString().split('.');
  if (str[0].length >= 4) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 4) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}

var onEachFeature = function(feature, layer) {
  var up = true;
  var change = feature.properties.jobsData_j;
  if (change < 0) { 
    change = change * -1;
    up = false;
  }
  change = (change * 100).toFixed(2);
  layer.bindPopup(ich.popupTemplate({
    change: change,
    up: up,
    now: feature.properties.jobsData_1,
    then: feature.properties.jobsData_n,
    diff: commafy(feature.properties.jobsData_d)
  }));
  layer.on({
    click: function(e) {
      focused = layer;
      layer.setStyle({ weight: 2, fillOpacity: 1 });
    },
    mouseover: function(e) {
      layer.setStyle({ weight: 2, fillOpacity: 1 });
    },
    mouseout: function(e) {
      if (focused && focused == layer) { return }
      layer.setStyle({ weight: 0.5, fillOpacity: 0.5 });
    }
  });
};

map.on("popupclose", function() {
  if (focused) {
    focused.setStyle({ weight: 0.5, fillOpacity: 0.5 });
    focused = false;
  }
});

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
    fillColor: getColor(feature.properties.jobsData_j),
    weight: 0.5,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.5
  };
}

L.geoJson(data, {
  style: style, 
  onEachFeature: onEachFeature
}).addTo(map);