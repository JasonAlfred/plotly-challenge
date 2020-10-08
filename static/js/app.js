function InitDashboard() {
    let selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {

        let sampleNames = data.names;

        sampleNames.forEach((sampleId)  => {
            selector.append("option")
                .text(sampleId)
                .property("value", sampleId);
        });

        let sampleRecord = sampleNames[0];

        DrawBarGraph(sampleRecord);
        DrawBubbleChart(sampleRecord);
        getMetaData(sampleRecord);
    });
}

function DrawBarGraph(sampleRecord) {

    d3.json("samples.json").then((data) => {

        let resultArray = data.samples.filter(s => s.id == sampleRecord);
        let result = resultArray[0]
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sampleValues = result.sample_values;
        let yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();

    let barData = {
        x:sampleValues.slice(0,10).reverse(),
        y: yticks,
        type: "bar",
        text: otu_labels.slice(0,10).reverse(),
        orientation: "h"
        }

    let barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {t: 100, l: 100}
        }

        Plotly.newPlot("bar", [barData], barLayout);
    })
}



function DrawBubbleChart(sampleRecord) {

    d3.json("samples.json").then((data) => {

        let filterSamplesArray = data.samples.filter(s => s.id == sampleRecord);
        let result = filterSamplesArray[0];
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            text: otu_labels,
            marker: {
                size: sample_values,
                color: otu_ids,
                sizeref:  Math.max(...sample_values) / 3000,
                sizemode: 'area'
            }
        }

        let barLayout = {
            title: "Samples",
            xaxis: { 
                title: {
                text: "OTU id"
                }},

            yaxis: { 
                title: {
                text: "Bacteria Count"
                }},

            margin: {t: 30, l: 150}
        }

        Plotly.newPlot("bubble", [bubbleData], barLayout);
    })}

function optionChanged(sampleRecord) {
    DrawBarGraph(sampleRecord);
    DrawBubbleChart(sampleRecord);
    getMetaData(sampleRecord);
}

function getMetaData(sampleRecord) {
    d3.json("samples.json").then((data) => {

        let resultArray = data.metadata.filter(md => md.id == sampleRecord);
        let result = resultArray[0];

        let panel = d3.select('#sample-metadata');
        panel.html("");

        Object.entries(result).forEach(([k,v]) => {
            let capitalKey = capitalizeKey(k);
            panel.append("h6").text(`${capitalKey}, ${v}`);
        })
    })
}


function capitalizeKey(key) {
    if (typeof key !== 'string') return key;
    return key.charAt(0).toUpperCase() + key.slice(1)   
}

InitDashboard();