
// Show only the United States when using Leaflet.js https://stackoverflow.com/questions/28117281/show-only-united-states-when-using-leaflet-js-and-osm
var maxBounds = L.latLngBounds(
    L.latLng(5.499550, -167.276413), //Southwest
    L.latLng(83.162102, -52.233040)  //Northeast
    );

// Create our map
var myMap= L.map('map', {
    'center': [37.8, -96],
    'zoom': 15,
    'maxBounds': maxBounds
}).fitBounds(maxBounds);


// Define a chooseColor function that will give each State a different color based on the number of facilities available
function chooseColor(numberoffacilities){
    if (numberoffacilities < 5) return "white";
    else if (numberoffacilities < 10) return "yellow";
    else if (numberoffacilities < 15) return "orange";
    else if (numberoffacilities < 20) return "red";
    else return "maroon";
};

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Add a legend to display information about our map
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    number = [5, 10, 15, 20];
    
    div.innerHTML += "<h3 style='text-align: center'>No of Facilities</h3>"
    
    for (var i = 0; i < number.length; i++) {
        div.innerHTML +=
        '<i style="background:' + chooseColor(number[i] + 1) + '"></i> ' + number[i] + (number[i + 1] ? '&ndash;' + number[i + 1] + '<br>' : '+');
    }
    
    return div;
};

// Add our legend to the map
legend.addTo(myMap);

// Adding control
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); 
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Rehab Facilities</h4>' +  (props ?
        '<b>' + props.state_name + '</b><br />' + props.number + ' facilites / mi<sup>2</sup>'
        : 'Hover over a state');
};

info.addTo(myMap);



    