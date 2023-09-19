d3.json("../Data/JSON_Files/us-states.geojson")
  .then(function (usStatesData) {
    d3.json("../Data/JSON_Files/Alcohol_Consumption_by_State_2022.json")
      .then(function (alcohol_data) {
        // Iterate through the features in usStatesData and add Alcohol Consumption data to properties
        usStatesData.features.forEach(function (stateFeature) {
          const stateName = stateFeature.properties.name;

          // Find the corresponding state in the alcohol data
          const matchingState = alcohol_data.find(function (alcoholState) {
            return alcoholState.State === stateName;
          });

          if (matchingState) {
            stateFeature.properties["Alcohol Consumption Per Capita"] = matchingState["Alcohol Consumption Per Capita"];
            stateFeature.properties["Ethanol Consumption Per Capita"] = matchingState["Ethanol Consumption Per Capita"];
            stateFeature.properties["Beer Consumption Per Capita"] = matchingState["Beer Consumption Per Capita"];
            stateFeature.properties["Wine Consumption Per Capita"] = matchingState["Wine Consumption Per Capita"];
          } else {
            stateFeature.properties["Alcohol Consumption Per Capita"] = 0;
            stateFeature.properties["Ethanol Consumption Per Capita"] = 0;
            stateFeature.properties["Beer Consumption Per Capita"] = 0;
            stateFeature.properties["Wine Consumption Per Capita"] = 0;
          }
        });

        // Now, usStatesData has the "Alcohol Consumption Per Capita" data in its properties
        console.log(usStatesData);
      
        let myMap = L.map('map').setView([37.8, -96], 3);

        let tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(myMap);
      
        
       L.geoJson(usStatesData, {style: style, onEachFeature:customOnEachFeature}).addTo(myMap);// Create the info control
       
       var info = L.control({position:'bottomleft'});

       info.onAdd = function (map) {
           this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
           this.update();
           return this._div;
       };

       // method that we will use to update the control based on feature properties passed
       info.update = function (props) {
           this._div.innerHTML = '<h3>US Alcohol Consumption in 2022</h3>' +  (props ?
               '<h4>' + props.name + '</h4><br>' +
               '<strong>Total Alcohol Consumption: '+ props["Alcohol Consumption Per Capita"] + ' gallons</strong><br>'+
               'Beer Consumption: ' + props["Beer Consumption Per Capita"] + ' gallons<br>' +
               'Wine Consumption: ' + props["Wine Consumption Per Capita"] + ' gallons<br>' +
               'Ethanol Consumption: ' + props["Ethanol Consumption Per Capita"] + ' gallons'
               : 'Click on a state');
       };

       // Add the info control to your map (myMap)
       info.addTo(myMap);

       // Event handler for state click
      function highlightFeature(e) {
        var layer = e.target;
        
        // Update the info box with the clicked state's properties
        info.update(layer.feature.properties);
      }

        // Reset the highlight on mouseout
        function resetHighlight(e) {
          info.update(); // Reset the info box to its default content
        }

        // Function to add the event listeners to the state features
        function customOnEachFeature(feature, layer) {
          layer.on({
              click: highlightFeature
          });
        }
        
        var legend = L.control({ position: 'bottomright' });

        var labels = ['16-24', '24-32', '32-40', '40-48', '48-56', '56+'];

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');

            // loop through the color intervals from the getColor function
            for (var i = 0; i < labels.length; i++) {
                var label=labels[i];
                var color = getColor(getRangeValue(label));
                div.innerHTML +=
                    '<i style="background:' + color + '"></i> ' +
                    label + '<br>';
            }

            return div;
          };
          legend.addTo(myMap)

          function getRangeValue(label) {
            return parseInt(label.split('-')[0]);
        }

      });
  });

function getColor(d) {
  return  d >= 56  ? '#a50f15' :
          d >= 48  ? '#de2d26' :
          d >= 40  ? '#fb6a4a' :
          d >= 32  ? '#fc9272' :
          d >= 24  ? '#fcbba1' :
          d >= 16  ? '#fee5d9' :
          "#ccc";
}

function style(feature) {
  return {
      fillColor: getColor(feature.properties["Alcohol Consumption Per Capita"]),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

