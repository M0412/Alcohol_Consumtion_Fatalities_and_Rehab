
// Create our map
var map = L.map('map').setView([37.8, -96], 4);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    zoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Define a chooseColor function that will give each State a different color based on the number of facilities available
function chooseColor(numberoffacilities){
    if (numberoffacilities < 5) return "white";
    else if (numberoffacilities < 10) return "yellow";
    else if (numberoffacilities < 15) return "orange";
    else if (numberoffacilities < 20) return "red";
    else return "maroon";
};

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
legend.addTo(map)

// Adding control
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Rehab Facilities</h4>' +  (props ?
        '<b>' + props.state_name + '</b><br />' + props.number + ' facilites / mi<sup>2</sup>'
        : 'Hover over a state');
};

info.addTo(map);
