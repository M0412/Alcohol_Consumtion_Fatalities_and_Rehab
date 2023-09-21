const url = '../static/Data/JSON_Files/samhsa_alcohol.json';

const dataPromise = d3.json(url);

let plotdata;
let selectedData;

const racesToExtract = [
    "White",
    "Black or African-American",
    "American Indian or Alaska Native",
    "Asian or Native Hawaiian or Other Pacific Islander",
    "Other",
    "Unknown_race"
  ];

const gendersToExtract = [
    "Male",
    "Female",
    "Unknown_gender"
]  

function init() {
    let dropdownMenu = d3.select("#selDataset");

    dataPromise.then(data => {
        plotdata = data;

        console.log(data);

        plotdata.forEach(item => {
            console.log(item.State);
            dropdownMenu.append('option')
            .text(item.State)
            .property("value", item.State);
        });

        let firstSample = plotdata[0].State;
        getSelectedData(firstSample);

        buildBarPlot(selectedData);
        buildGenderPieChart(selectedData);
        buildRacePieChart(selectedData);
    });

}

init();

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

function buildBarPlot(selectedData) {

    let ageData = Object.entries(selectedData).filter(([key]) => key.includes("years") || key == ("Unknown_age")).map(([key, value]) => ({ key, value }));


    let xAxis = ageData.map(pair => pair.key);
    let yAxis = ageData.map(pair => pair.value);

    let barPlot = {
        x: xAxis,
        y: yAxis,
        type: "bar",
        orientation: "v"
    }

    Plotly.newPlot('bar', [barPlot]);
}

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
        type: "pie"
    };

    let layout = {
        height: 500,
        width: 650
    }

    Plotly.newPlot("genderPie", [pieChart], layout);

    console.log(genderData);
}

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
        type: "pie"
    };

    let layout = {
        height: 570,
        width: 720
    }

    Plotly.newPlot("racePie", [pieChart], layout);
}

function optionChanged(value) {
    getSelectedData(value);
    buildBarPlot(selectedData);
    buildGenderPieChart(selectedData);
    buildRacePieChart(selectedData);
}


  