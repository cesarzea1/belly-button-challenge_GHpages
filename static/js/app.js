// variable for the URL for the JSON file
const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// variable to store data
let data;

// Use D3 to call the JSON data
d3.json(url).then(jsonData => {
  // associate data to the Json data
  data = jsonData;

  // identify data in Json file for the charts
  const firstEntry = data.samples[0];

  // data variables for the bar chart
  const sampleValues = firstEntry.sample_values.slice(0, 10).reverse();
  const otuIds = firstEntry.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  const otuLabels = firstEntry.otu_labels.slice(0, 10).reverse();

  // bar chart
  createBarChart(sampleValues, otuIds, otuLabels);

  // data variables for the bubble chart
  const bubbleXValues = firstEntry.otu_ids;
  const bubbleYValues = firstEntry.sample_values;
  const bubbleMarkerSizes = firstEntry.sample_values;
  const bubbleMarkerColors = firstEntry.otu_ids;
  const bubbleTextValues = firstEntry.otu_labels;

  // bubble chart
  createBubbleChart(bubbleXValues, bubbleYValues, bubbleMarkerSizes, bubbleMarkerColors, bubbleTextValues);

  // sample metadata
  displaySampleMetadata(data.metadata[0]);

  // dropdown with sample IDs
  populateDropdown(data.names);
});

// Function to create the bar chart
function createBarChart(sampleValues, otuIds, otuLabels) {
  // trace for the bar chart
  const trace = {
    x: sampleValues,
    y: otuIds,
    text: otuLabels,
    type: "bar",
    orientation: "h"
  };

  // data array with the trace
  const data = [trace];

  // layout for the chart
  const layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };

  // Plotly to create the bar chart
  Plotly.newPlot("bar", data, layout);
}

// Function to create the bubble chart
function createBubbleChart(xValues, yValues, markerSizes, markerColors, textValues) {
  // trace for the bubble chart
  const trace = {
    x: xValues,
    y: yValues,
    mode: 'markers',
    marker: {
      size: markerSizes,
      color: markerColors,
      colorscale: 'Viridis',
      opacity: 0.6,
      showscale: true
    },
    text: textValues
  };

  // data array with the trace
  const data = [trace];

  // layout for the chart
  const layout = {
    title: 'Bubble Chart for Samples',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' },
    showlegend: false
  };

  // Plotly to create the bubble chart
  Plotly.newPlot('bubble', data, layout);
}

// Function to display sample metadata
function displaySampleMetadata(metadata) {
  const metadataPanel = d3.select("#sample-metadata");
  metadataPanel.html(""); // Clear existing metadata

  // Loop through metadata key-value pairs and display
  Object.entries(metadata).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`);
  });
}

// Function to populate the dropdown with sample IDs
function populateDropdown(sampleNames) {
  const dropdown = d3.select("#selDataset");

  // option for each sample ID
  sampleNames.forEach(sample => {
    dropdown.append("option").text(sample).attr("value", sample);
  });

  // Initialize with the first sample
  optionChanged(sampleNames[0]);
}

// Define the optionChanged function
function optionChanged(selectedSample) {

    // metadata for the selected sample
  const selectedMetadata = data.metadata.find(metadata => metadata.id.toString() === selectedSample);

  // Update the sample metadata
  displaySampleMetadata(selectedMetadata);
}