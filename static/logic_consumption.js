let selector = d3.select("#selDataset")
let alcohol_data

d3.json("../Data/JSON_Files/Alcohol_Consumption_by_State_2022.json")
.then(function (data) {
    console.log(data);

    alcohol_data = data;
    const dataTypes = [
        "Alcohol Consumption Per Capita",
        "Ethanol Consumption Per Capita",
        "Beer Consumption Per Capita",
        "Wine Consumption Per Capita"
      ];
  
      // Populate the dropdown with data types
      selector
        .selectAll("option")
        .data(dataTypes)
        .enter()
        .append("option")
        .text((d) => d)
        .property("value", (d) => d);

    const defaultDataType = dataTypes[0]; // Setting a default id for charts to appear
    optionChanged(defaultDataType);

    selector.on("change", optionChanged);

    updateBarChart(defaultDataType, alcohol_data);
    });

    // Define the optionChanged function
function optionChanged() {
    // Get the selected value from the dropdown
    const selectedDataType = selector.property("value");
  
    // Update the bar chart based on the selected data type
    updateBarChart(selectedDataType, alcohol_data);
  }
  
  // Function to update or create the bar chart using Plotly
  function updateBarChart(dataType, data) {
    // Extract the data for the selected data type
    const chartData = data.map((state) => ({
      x: state.State,
      y: state[dataType],
      type: "bar",
      name: dataType,
    }));

    const layout = {
        title: 'Alcohol Consumption by State',
        xaxis: {
          title: 'State',
        },
        yaxis: {
          title: 'Consumption',
        },
      };
  
    // Update the bar chart using Plotly
    Plotly.newPlot("bar", chartData, layout);
  }