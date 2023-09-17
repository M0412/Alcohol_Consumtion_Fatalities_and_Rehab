
// Show only the United States when using Leaflet.js https://stackoverflow.com/questions/28117281/show-only-united-states-when-using-leaflet-js-and-osm
var maxBounds = L.latLngBounds(
    L.latLng(5.499550, -167.276413), //Southwest
    L.latLng(83.162102, -52.233040)  //Northeast
    );

// Create our map
var myMap= L.map('map', {
    'center': [0, 0],
    'zoom': 0,
    'maxBounds': maxBounds
}).fitBounds(maxBounds);


// Define a chooseColor function that will give each State a different color based on the number of facilities available
function chooseColor(numberoffacilities){
    if (numberoffacilities < 10) return "greenyellow";
    else if (numberoffacilities < 30) return "yellowgreen";
    else if (numberoffacilities < 50) return "yellow";
    else if (numberoffacilities < 70) return "orange";
    else return "red";
};

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Add a legend to display information about our map
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    number = [10, 30, 50, 70];
    
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
    
    for (var i = 0; i < number.length; i++) {
        div.innerHTML +=
        '<i style="background:' + chooseColor(number[i] + 1) + '"></i> ' + number[i] + (number[i + 1] ? '&ndash;' + number[i + 1] + '<br>' : '+');
    }
    
    return div;
};

// Add our legend to the map
legend.addTo(myMap)


    