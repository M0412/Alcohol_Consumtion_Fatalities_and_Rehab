
// Create our map object
var map = L.map('rehab_map').setView([37.8, -96], 4);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    zoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Saving our data in a variable
const data = "../static/Data/JSON_Files/New_Rehab_Facilities_by_State.json";

// Console log our data
d3.json(data).then(function(response){
    // Create a new marker cluster group.
    let markers = L.markerClusterGroup({'animate': false});
    //console.log(response)
    console.log(response.length);

    // specify popup options 
    const customOptions = {
        'maxWidth': '400',
        'width': '200',
        'className' : 'popupCustom'
    };
    var facility_count = 0;
    // Loop through the data.
    for (let i = 0; i < response.length; i++) {

        // Get facility array for state i
        let facilityList = response[i].facilities;

        // Loop through facility array 
        for (let j = 0; j < facilityList.length; j++){
            facility_count++;
            // For each facility set the data location property to a variable
            let location_long = facilityList[j].Longitude;
            let location_lat = facilityList[j].Latitude;
            //console.log(location1,location2)

            // Check for the location property.
            if (location_long && location_lat) {
                //console.log("found marker")

                var popup = ("<h4>" + facilityList[j].name1 
                            + "</h4><hr><h5>" + facilityList[j].street1 
                            + ",</h5><h5>" + facilityList[j].city 
                            + ", " + response[i].state_name 
                            + ", " + facilityList[j].zip 
                            + "</h5>");

                // Add a new marker to the cluster group, and bind a popup.
                markers.addLayer(L.marker([location_lat, location_long])
                .bindPopup(popup,customOptions));
            };
        };
        
        
    };
    console.log(facility_count);
    // Add our marker cluster layer to the map.
    map.addLayer(markers);
    console.log("rehab line 58");
    // var evt = document.createEvent('UIEvents');
    // evt.initUIEvent('resize', true, false, window, 0);
    // window.dispatchEvent(evt);
});
