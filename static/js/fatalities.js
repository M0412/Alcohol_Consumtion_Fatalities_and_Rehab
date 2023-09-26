// Assign a URL constant to our data file path
const url = '../static/Data/JSON_Files/samhsa_alcohol.json';

// Creating our data Promise element to ensure data is collected on the console
const dataPromise = d3.json(url);

// Creating variables for our graphs
let plotdata;
let selectedData;

// Creating a constant for Race
const racesToExtract = [
    "White",
    "Black or African-American",
    "American Indian or Alaska Native",
    "Asian or Native Hawaiian or Other Pacific Islander",
    "Other",
    "Unknown_race"
  ];

// Creating a constant for Gender
const gendersToExtract = [
    "Male",
    "Female",
    "Unknown_gender"
];

// Creating a function that creates a drop-down element for our fatality parameters, i.e for California, Texas and Florida
function init() {
    let dropdownMenu = d3.select("#selDataset");

    dataPromise.then(data => {
        plotdata = data;

        console.log(data);

        // Appending each state in the JSON path to our drop-down
        plotdata.forEach(item => {
            console.log(item.State);
            dropdownMenu.append('option')
            .text(item.State)
            .property("value", item.State);
        });

        let firstSample = plotdata[0].State;
        getSelectedData(firstSample);

        // Calling our functions to build our respective plots for the selected State
        buildBarPlot(selectedData);
        buildGenderPieChart(selectedData);
        buildRacePieChart(selectedData);
    });

}

init();

// Creating a function to set the default element to our drop down
function getSelectedData(state) {
    // if by mistake the plotdata is lost, we will reset the page to init() mode
    // which sets the plotdata
    if(plotdata === null || plotdata === undefined) {
        init();
        return;
    }
    plotdata.forEach(item => {
        if(item.State == state) {
            selectedData = item;
        }
    })
}

// Creating a function to build our bar plot
function buildBarPlot(selectedData) {

    let ageData = Object.entries(selectedData).filter(([key]) => key.includes("years") || key == ("Unknown_age")).map(([key, value]) => ({ key, value }));
    let xAxis = ageData.map(pair => pair.key);
    let yAxis = ageData.map(pair => pair.value);

    // Add barplot details
    let barPlot = {
        x: xAxis,
        y: yAxis,
        type: "bar",
        orientation: "v",
        marker:{color:'184e77'}
    };

    // Add your y-label here
    let layout = {
        yaxis: {
            title: 'Percent (%)', 
        }
    };

    Plotly.newPlot('bar', [barPlot], layout);
}

// Creating a function to build of pie chart for Gender of fatalities
function buildGenderPieChart(selectedData) {

    let genderData = {};

    for(const key of gendersToExtract) {
        if(selectedData.hasOwnProperty(key)) {
            genderData[key] = parseFloat(selectedData[key].replace(/,/g, ''));
        }
    }


    let pieChart = {
        values: Object.values(genderData),
        labels: Object.keys(genderData),
        type: "pie",
        marker:{
            colors:[
                '184e77',
                'f4978e',
                'f5f3f4'
            ]
        }
    };

    let layout = {
        height: 500,
        width: 600
    }

    Plotly.newPlot("genderPie", [pieChart], layout);

    console.log(genderData);
}

// Creating a function to build of pie chart for Race of fatalities
function buildRacePieChart(selectedData) {
    let raceData = {};

    for(const key of racesToExtract) {
        if(selectedData.hasOwnProperty(key)) {
            raceData[key] = parseFloat(selectedData[key].replace(/,/g, ''));
        }
    }

    let pieChart = {
        values: Object.values(raceData),
        labels: Object.keys(raceData),
        type: "pie",
        marker:{
            colors: [
                '184e77',
                '168aad',
                '52b69a',
                '99d98c',
                'd9ed92',
                'f0f3bd'
            ]
        }
    };

    let layout = {
        height: 570,
        width: 720
    }

    Plotly.newPlot("racePie", [pieChart], layout);
}

// Building another function that allows the use to select a different element in our drop-down and visualize our data
function optionChanged(value) {
    getSelectedData(value);
    buildBarPlot(selectedData);
    buildGenderPieChart(selectedData);
    buildRacePieChart(selectedData);
}


  